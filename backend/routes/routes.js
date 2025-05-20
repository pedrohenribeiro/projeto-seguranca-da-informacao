const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/AuthMiddleware');

router.post(
  '/register',
  [
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'admin'])
  ],
  controller.register
);

router.post('/login', controller.login);

router.get('/users', verifyToken, controller.getAllUsers);

module.exports = router;
