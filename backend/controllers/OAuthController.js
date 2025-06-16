const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { OAuthClientApp, OAuthAccessGrant, User } = require('../models');

const authCodes = new Map();

module.exports = {
  async showConsentPage(req, res) {
    const { response_type, client_id, redirect_uri, scope, state } = req.query;

    if (response_type !== 'code') {
      return res.status(400).json({ error: 'response_type inválido' });
    }

    const app = await OAuthClientApp.findOne({ where: { client_id } });
    if (!app || !app.redirect_uris.includes(redirect_uri)) {
      return res.status(400).json({ error: 'client_id ou redirect_uri inválido' });
    }

    res.render('oauth-consent', {
      appName: app.name,
      client_id,
      redirect_uri,
      scope,
      state,
    });
  },

  async confirmConsent(req, res) {
    const { email, password, client_id, redirect_uri, state, scope } = req.body;

    const app = await OAuthClientApp.findOne({ where: { client_id } });
    if (!app || !app.redirect_uris.includes(redirect_uri)) {
      return res.status(400).render('oauth-consent', {
        error: 'Aplicativo inválido',
        client_id,
        redirect_uri,
        scope,
        state,
        appName: app?.name ?? 'Aplicativo'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).render('oauth-consent', {
        error: 'Credenciais inválidas',
        client_id,
        redirect_uri,
        scope,
        state,
        appName: app.name
      });
    }

    const code = crypto.randomBytes(16).toString('hex');
    authCodes.set(code, {
      userId: user.id,
      client_id,
      scope,
      createdAt: Date.now(),
    });

    const existingGrant = await OAuthAccessGrant.findOne({
      where: { user_id: user.id, client_id: app.client_id },
    });

    if (existingGrant) {
      await existingGrant.update({
        scopes: scope,
        granted_at: new Date(),
      });
    } else {
      await OAuthAccessGrant.create({
        user_id: user.id,
        client_id: app.client_id,
        scopes: scope,
        granted_at: new Date(),
      });
    }

    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set('code', code);
    if (state) redirectUrl.searchParams.set('state', state);

    return res.redirect(redirectUrl.toString());
  },

  async exchangeToken(req, res) {
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
  },

  async createApp(req, res) {
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
  },

  async listIntegrations(req, res) {
    const { id, role } = req.user;

    try {
      if (role === 'empresa') {
        const apps = await OAuthClientApp.findAll({ where: { user_id: id } });
        return res.json({ tipo: 'empresa', apps });
      } else {
        const grants = await OAuthAccessGrant.findAll({
          where: { user_id: id },
          include: [{
            model: OAuthClientApp,
            as: 'clientApp',
            attributes: ['name', 'client_id', 'client_secret', 'redirect_uris'],
          }]
        });

        const integracoes = grants.map(grant => ({
          nomeApp: grant.clientApp?.name,
          client_id: grant.clientApp?.client_id,
          scopes: grant.scopes,
          concedido_em: grant.granted_at,
        }));

        return res.json({ tipo: 'usuario', integracoes });
      }
    } catch (err) {
      console.error('Erro ao buscar integrações', err);
      res.status(500).json({ error: 'Erro interno ao buscar integrações' });
    }
  },

  async deleteIntegration(req, res) {
    const { id: userId, role } = req.user;
    const { client_id } = req.params;

    try {
      if (role === 'empresa') {
        const app = await OAuthClientApp.findOne({
          where: { client_id, user_id: userId },
        });

        if (!app) {
          return res.status(404).json({ error: 'Aplicação não encontrada ou não pertence a você.' });
        }

        await app.destroy();
        return res.json({ message: 'Aplicação excluída com sucesso.' });
      } else {
        const grant = await OAuthAccessGrant.findOne({
          where: { client_id, user_id: userId },
        });

        if (!grant) {
          return res.status(404).json({ error: 'Autorização não encontrada.' });
        }

        await grant.destroy();
        return res.json({ message: 'Autorização revogada com sucesso.' });
      }
    } catch (error) {
      console.error('Erro ao excluir integração:', error);
      return res.status(500).json({ error: 'Erro interno ao excluir integração.' });
    }
  }
};
