const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { verifyUserCredentials } = require('../controllers/UserController');
const authCodes = new Map();

router.get('/authorize', (req, res) => {
  const { response_type, client_id, redirect_uri, scope, state } = req.query;

  if (response_type !== 'code') {
    return res.status(400).json({ error: 'response_type inválido' });
  }

  res.render('oauth-consent', {
    client_id,
    redirect_uri,
    scope,
    state,
  });
});

router.post('/authorize', async (req, res) => {
  const { email, password, client_id, redirect_uri, state } = req.body;

  const user = await verifyUserCredentials(email, password);
  if (!user) {
    return res.status(401).render('oauth-consent', {
      client_id,
      redirect_uri,
      scope: '',
      state,
      error: 'Credenciais inválidas. Tente novamente.',
    });
  }

  const code = crypto.randomBytes(20).toString('hex');
  authCodes.set(code, { userId: user.id, client_id, createdAt: Date.now() });

  setTimeout(() => authCodes.delete(code), 10 * 60 * 1000);

  const redirectWithCode = `${redirect_uri}?code=${code}&state=${state}`;
  res.redirect(redirectWithCode);
});

// Troca código por token JWT (POST /oauth/token)
router.post('/token', (req, res) => {
  const { code, client_id } = req.body;

  if (!authCodes.has(code)) {
    return res.status(400).json({ error: 'Código inválido ou expirado' });
  }

  const data = authCodes.get(code);
  if (client_id !== data.client_id) {
    return res.status(400).json({ error: 'Client ID inválido' });
  }

  const token = jwt.sign({ id: data.userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

  authCodes.delete(code);

  res.json({ access_token: token, token_type: 'Bearer', expires_in: 86400 });
});

module.exports = router;
