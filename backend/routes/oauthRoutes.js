const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/AuthMiddleware');
const OAuthController = require('../controllers/OAuthController');

router.get('/authorize', OAuthController.showConsentPage);
router.post('/authorize/confirm', OAuthController.confirmConsent);
router.post('/token', OAuthController.exchangeToken);
router.post('/apps', verifyToken, OAuthController.createApp);
router.get('/integracoes', verifyToken, OAuthController.listIntegrations);
router.delete('/integracoes/:client_id', verifyToken, OAuthController.deleteIntegration);

module.exports = router;
