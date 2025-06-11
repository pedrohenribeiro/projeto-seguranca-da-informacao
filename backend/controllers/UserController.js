const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../models');
const sequelize = db.sequelize;
const UserInativo = require('../models/UserInativo');
const User = db.User;
const UserTerm = db.UserTerm;
const Term = db.Term; // import do model Term


exports.register = async (req, res) => {
  try {
    const { username, email, telefone, password, role, nome, cpf, termosAceitos } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome de usuário já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      cpf,
      nome,
      telefone,
      password: hashedPassword,
      role,
    });

    if (Array.isArray(termosAceitos) && termosAceitos.length > 0) {
      const userTerms = termosAceitos.map(termId => ({
        user_id: user.id,
        term_id: termId,
        aceito_em: new Date(),
      }));

      await UserTerm.bulkCreate(userTerms);
    }

    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Buscar todos os termos cadastrados
    const todosTermos = await Term.findAll();

    // Buscar termos aceitos pelo usuário
    const termosAceitos = await UserTerm.findAll({
      where: { user_id: user.id }
    });

    const idsAceitos = termosAceitos.map(t => t.term_id);

    // Verificar se há termos não aceitos
    const termosNaoAceitos = todosTermos.filter(termo => !idsAceitos.includes(termo.id));
    const alertaNovosTermos = termosNaoAceitos.length > 0;

    // Verificar se aceitou o termo de comunicações promocionais (ID 14)
    const comunicacoesPromocionaisAtivas = idsAceitos.includes(14);

    res.json({
      token,
      alertaNovosTermos,
      mensagem: alertaNovosTermos
        ? 'Novos termos de serviço foram adicionados. Por favor, revise na tela de Termos de Serviço.'
        : null,
      comunicacoesPromocionaisAtivas,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Buscar termos aceitos pelo usuário
    const termosAceitos = await UserTerm.findAll({
      where: { user_id: userId },
      attributes: ['term_id'],
    });

    const idsAceitos = termosAceitos.map(t => t.term_id);

    // Verifica se o usuário aceitou o termo de comunicações promocionais (ID 14)
    const comunicacoesPromocionaisAtivas = idsAceitos.includes(14);

    res.json({
      ...user.toJSON(),
      termosAceitos: idsAceitos, // array com IDs dos termos aceitos
      comunicacoesPromocionaisAtivas,
    });
  } catch (err) {
    console.error('Erro em getMe:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, telefone, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (telefone) user.telefone = telefone;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    res.json({ message: 'Usuário atualizado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMe = async (req, res) => {
  const userId = req.user.id;
  let t;
  try {
    t = await sequelize.transaction();

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await UserInativo.create({ userId });

    await user.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Conta removida e marcada como inativa.' });
  } catch (err) {
    if (t) await t.rollback();
    console.error('Erro em deleteMe:', err);
    res.status(500).json({ error: 'Erro ao apagar conta' });
  }
};