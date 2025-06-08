const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuthClientApp } = require('../models');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middlewares/AuthMiddleware');

const { verifyUserCredentials } = require('../controllers/UserController');
const authCodes = new Map();

router.get('/authorize', async (req, res) => {
  const { response_type, client_id, redirect_uri, scope, state } = req.query;

  if (response_type !== 'code') {
    return res.status(400).json({ error: 'response_type inválido' });
  }

  const app = await OAuthClientApp.findOne({ where: { client_id } });
  if (!app || !app.redirect_uris.includes(redirect_uri)) {
    return res.status(400).json({ error: 'client_id ou redirect_uri inválido' });
  }

  res.render('oauth-consent', {
    client_id,
    redirect_uri,
    scope,
    state,
    appName: app.name,
  });
});

router.post('/authorize/confirm', async (req, res) => {
  const { email, password, client_id, redirect_uri, state, scope } = req.body;

  const app = await OAuthClientApp.findOne({ where: { client_id } });
  if (!app || !app.redirect_uris.includes(redirect_uri)) {
    return res.status(400).render('oauth-consent', { error: 'Aplicativo inválido', client_id, redirect_uri, scope, state });
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).render('oauth-consent', { error: 'Credenciais inválidas', client_id, redirect_uri, scope, state });
  }

  const code = crypto.randomBytes(16).toString('hex');
  authCodes.set(code, {
    userId: user.id,
    client_id,
    scope,
    createdAt: Date.now(),
  });

  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set('code', code);
  if (state) redirectUrl.searchParams.set('state', state);

  return res.redirect(redirectUrl.toString());
});

router.post('/token', async (req, res) => {
  const { code, client_id, client_secret, redirect_uri } = req.body;

  if (!authCodes.has(code)) {
    return res.status(400).json({ error: 'Código inválido ou expirado' });
  }

  const data = authCodes.get(code);

  if (client_id !== data.client_id) {
    return res.status(400).json({ error: 'Client ID inválido' });
  }

  const app = await OAuthClientApp.findOne({ where: { client_id } });

  if (!app || app.client_secret !== client_secret) {
    return res.status(401).json({ error: 'Credenciais do cliente inválidas' });
  }

  if (!app.redirect_uris.includes(redirect_uri)) {
    return res.status(400).json({ error: 'redirect_uri inválido' });
  }

  const token = jwt.sign({ id: data.userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

  authCodes.delete(code);

  
  res.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in: 86400,
  });
});

router.post('/apps', verifyToken, async (req, res) => {
  const { name, redirect_uris } = req.body;
  const user_id = req.user.id; 

  const client_id = crypto.randomBytes(16).toString('hex');
  const client_secret = crypto.randomBytes(32).toString('hex');

  const app = await OAuthClientApp.create({
    name,
    client_id,
    client_secret,
    redirect_uris,
    user_id,
  });

  res.json({
    client_id: app.client_id,
    client_secret: app.client_secret,
  });
});


module.exports = router;
