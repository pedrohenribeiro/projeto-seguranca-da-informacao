const Receita = require('../models/receita');
require('dotenv').config();

exports.registerReceita = async (req, res) => {
  try {
    const { nomereceita, descricao, imagem, ingredientes, modopreparo, rendimento, tempopreparo } = req.body;

    const receita = await Receita.create({
        nomereceita,
        descricao,
        imagem,
        ingredientes,
        modopreparo,
        rendimento,
        tempopreparo
    });
    if (!nomereceita || !descricao || !imagem || !ingredientes || !modopreparo || !rendimento || !tempopreparo) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios'
      });
    }

    res.status(201).json({ message: 'Receita cadastrada com sucesso', receita });
  } catch (error) {
     console.error('Erro ao cadastrar receita:', error);
    res.status(500).json({
      error: 'Erro interno ao cadastrar receita.',
    });
  }
};

exports.getAllReceitas = async (req, res) => {
  const receitas = await Receita.findAll();
  res.json(receitas);
};

exports.updateReceita = async (req, res) => {
  try {
    const receitaId = req.id;
    const { nomereceita, descricao, imagem, ingredientes, modopreparo, rendimento, tempopreparo } = req.body;

    const receita = await Receita.findByPk(receitaId);
    if (!receita) return res.status(404).json({ error: 'Receita não encontrada' });

    if (nomereceita) receita.nomereceita = nomereceita;
    if (descricao) receita.descricao = descricao;
    if (imagem) receita.imagem = imagem;    
    if (ingredientes) receita.ingredientes = ingredientes;
    if (modopreparo) receita.modopreparo = modopreparo;
    if (rendimento) receita.rendimento = rendimento;
    if (tempopreparo) receita.tempopreparo = tempopreparo; 

    await receita.save();

    res.json({ message: 'Receita atualizada com sucesso', receita });
  } catch (err) {
    console.error('Erro ao atualizar receita:', error);
    res.status(500).json({
      error: 'Erro interno ao atualizar receita.',
    });
  }
};

exports.deleteReceita = async (req, res) => {
  try {
    const receitaId = req.params.id;

    const receita = await Receita.findByPk(receitaId);
    if (!receita) {
      return res.status(404).json({ error: 'Receita não encontrada' });
    }

    await receita.destroy();

    res.json({ message: 'Receita deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar receita:', error);
    res.status(500).json({
      error: 'Erro interno ao deletar receita.',
    });
  }
};
