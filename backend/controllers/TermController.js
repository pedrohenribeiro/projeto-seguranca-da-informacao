const db = require('../models'); // Importa o db para usar Term e UserTerm juntos
const { Term, UserTerm } = db;

exports.getAllTerms = async (req, res) => {
  try {
    const terms = await db.Term.findAll({
      attributes: ['id', 'nome', 'detalhes', 'obrigatorio', 'createdAt'], // pega os campos importantes
      order: [['id', 'ASC']]
    });
    res.json(terms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserTerms = async (req, res) => {
  const userId = req.user.id;

  try {
    const records = await db.UserTerm.findAll({
      where: { user_id: userId },
      attributes: ['term_id', 'aceito_em'], // pega o id do termo e a data do aceite
      raw: true
    });

    // Retorna um array de objetos com term_id e aceito_em para ajudar no front
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTermsWithUserStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Busca todos os termos
    const terms = await Term.findAll({
      attributes: ['id', 'nome', 'detalhes', 'obrigatorio'],
      raw: true,
    });

    // Busca quais termos o usuário aceitou, com data
    const userTerms = await UserTerm.findAll({
      where: { user_id: userId },
      attributes: ['term_id', 'aceito_em'],
      raw: true,
    });

    // Mapeia os termos do usuário para acesso rápido
    const userTermsMap = {};
    userTerms.forEach(ut => {
      userTermsMap[ut.term_id] = ut.aceito_em;
    });

    // Junta dados: marca aceito e data se existir
    const result = terms.map(term => ({
      id: term.id,
      nome: term.nome,
      detalhes: term.detalhes,
      obrigatorio: term.obrigatorio,
      aceito: userTermsMap[term.id] ? true : false,
      aceito_em: userTermsMap[term.id] || null,
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.acceptTerm = async (req, res) => {
  const userId = req.user.id;
  const termId = parseInt(req.params.termId);

  try {
    await db.UserTerm.upsert({
      user_id: userId,
      term_id: termId,
      aceito_em: new Date(),
    });
    res.json({ message: 'Termo aceito com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unacceptTerm = async (req, res) => {
  const userId = req.user.id;
  const termId = parseInt(req.params.termId);

  try {
    const term = await db.Term.findByPk(termId);
    if (term.obrigatorio) {
      return res.status(400).json({ error: 'Termo obrigatório não pode ser desmarcado' });
    }

    await db.UserTerm.destroy({
      where: {
        user_id: userId,
        term_id: termId,
      },
    });

    res.json({ message: 'Termo desmarcado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTerm = async (req, res) => {
  try {
    const { nome, detalhes, obrigatorio } = req.body;
    const termo = await Term.create({ nome, detalhes, obrigatorio });
    res.status(201).json(termo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteTerm = async (req, res) => {
  const termId = parseInt(req.params.id);
  try {
    const termo = await Term.findByPk(termId);
    if (!termo) {
      return res.status(404).json({ error: 'Termo não encontrado' });
    }
    await termo.destroy();
    res.json({ message: 'Termo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Atualizar um termo existente
exports.atualizarTermo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, detalhes, obrigatorio } = req.body;

    if (!nome || !detalhes || obrigatorio === undefined) {
      return res.status(400).json({ error: 'Dados incompletos para atualizar o termo.' });
    }

    const termo = await Term.findByPk(id);

    if (!termo) {
      return res.status(404).json({ error: 'Termo não encontrado.' });
    }

    termo.nome = nome;
    termo.detalhes = detalhes;
    termo.obrigatorio = obrigatorio;
    await termo.save();

    res.status(200).json(termo);
  } catch (err) {
    console.error('Erro ao atualizar termo:', err);
    res.status(500).json({ error: 'Erro ao atualizar termo.' });
  }
};
