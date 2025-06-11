const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const userController = require('../controllers/UserController');
const enderecoController = require('../controllers/EnderecoController');
const { verifyToken } = require('../middlewares/AuthMiddleware');
const receitaController = require('../controllers/ReceitaController');
const TermController = require('../controllers/TermController');

router.post(
  '/register',
  [
    body('username').notEmpty(),
    body('nome').notEmpty(),
    body('cpf').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'admin'])
  ],
  userController.register
);

router.post('/login', userController.login);
router.get('/users', verifyToken, userController.getAllUsers);
router.get('/user', verifyToken, userController.getMe);
router.put('/user', verifyToken, userController.updateMe);
router.get('/terms', TermController.getAllTerms);
router.post('/terms', TermController.createTerm);
router.delete('/terms/:id', TermController.deleteTerm);
router.put('/terms/:id', TermController.atualizarTermo);



router.post(
  '/address',
  verifyToken,
  [
    body('cep').isLength({ min: 8, max: 8 }).matches(/^\d+$/),
    body('endereco').notEmpty(),
    body('bairro').notEmpty(),
    body('cidade').notEmpty(),
    body('estado').isLength({ min: 2, max: 2 }).matches(/^[A-Z]{2}$/),
    body('numero').notEmpty(),
    body('complemento').optional(),
  ],
  enderecoController.create
);

router.get('/address', verifyToken, enderecoController.getMyAddress);

router.put(
  '/address',
  verifyToken,
  [
    body('cep').optional().isLength({ min: 8, max: 8 }).matches(/^\d+$/),
    body('estado').optional().isLength({ min: 2, max: 2 }).matches(/^[A-Z]{2}$/),
  ],
  enderecoController.updateMyAddress
);

router.delete('/address', verifyToken, enderecoController.deleteMyAddress);

router.post('/receita', verifyToken, receitaController.registerReceita);
router.get('/user/terms', verifyToken, TermController.getUserTerms);
router.post('/user/terms/:termId/accept', verifyToken, TermController.acceptTerm);
router.delete('/user/terms/:termId/unaccept', verifyToken, TermController.unacceptTerm);
router.get('/user/terms-status', verifyToken, TermController.getTermsWithUserStatus);
router.get('/receitas', verifyToken, receitaController.getAllReceitas);
router.put('/receita/:id', verifyToken, receitaController.updateReceita);
router.delete('/receita/:id', verifyToken, receitaController.deleteReceita);

module.exports = router;
