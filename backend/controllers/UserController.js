const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../models');
const sequelize = db.sequelize;
const UserInativo = require('../models/UserInativo');
const User = db.User;
const UserTerm = db.UserTerm;
const Term = db.Term; 


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


    const todosTermos = await Term.findAll();

    const termosAceitos = await UserTerm.findAll({
      where: { user_id: user.id }
    });

    const idsAceitos = termosAceitos.map(t => t.term_id);


    const termosNaoAceitos = todosTermos.filter(termo => !idsAceitos.includes(termo.id));
    const alertaNovosTermos = termosNaoAceitos.length > 0;


    const comunicacoesPromocionaisAtivas = idsAceitos.includes(14);

    res.json({
      token,
      alertaNovosTermos,
      mensagem: alertaNovosTermos
        ? 'Uma nova versão dos termos de serviço está disponível. Por favor, revise a atualização na tela de Termos de Serviço.'
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

  
    const comunicacoesPromocionaisAtivas = idsAceitos.includes(14);

    res.json({
      ...user.toJSON(),
      termosAceitos: idsAceitos, 
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
    const { nome, email, telefone, cpf } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (telefone) user.telefone = telefone;
    if (cpf) user.cpf = cpf;
    /*if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }*/

    await user.save();

    res.json({ message: 'Usuário atualizado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.portabilidadeLogin = async (req, res) => {
  try {
    const { email, password, client_id, client_secret } = req.body;

    if (
      client_id !== process.env.CLIENT_ID_PORTABILIDADE ||
      client_secret !== process.env.CLIENT_SECRET_PORTABILIDADE
    ) {
      return res.status(401).json({ error: 'Credenciais inválidas da aplicação.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao autenticar usuário externo' });
  }
};

exports.verifyUserCredentials = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  return user;
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

    // 1) Marca como inativo no Mongo
    await UserInativo.create({ userId });

    // 2) Remove do MySQL (cascata em Favoritos e Endereco)
    await user.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Conta removida e marcada como inativa.' });

  } catch (err) {
    if (t) await t.rollback();
    console.error('Erro em deleteMe:', err);
    res.status(500).json({ error: 'Erro ao apagar conta' });
  }
};


exports.deleteSoftMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    await user.destroy();

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};