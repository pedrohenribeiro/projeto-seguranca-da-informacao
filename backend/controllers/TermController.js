const db = require('../models');
const { Term, UserTerm, TermVersion } = db;

// Buscar todos os termos da última versão
exports.getAllTerms = async (req, res) => {
  try {
    const ultimaVersao = await TermVersion.findOne({
      order: [['numero', 'DESC']],
    });

    if (!ultimaVersao) {
      return res.json([]);
    }

    const terms = await Term.findAll({
      where: { term_version_id: ultimaVersao.id },
      attributes: ['id', 'nome', 'detalhes', 'obrigatorio', 'createdAt'],
      order: [['id', 'ASC']],
    });

    res.json(terms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para incrementar string de versão (ex: "1.0" => "2.0")
const incrementarVersao = (versao) => {
  if (!versao) return '1.0';
  const num = parseFloat(versao);
  if (isNaN(num)) return '1.0';
  return (num + 1).toFixed(1);
};

// Criar termo e nova versão (clona termos antigos + adiciona novo termo obrigatório para todos os usuários)
exports.createTerm = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { nome, detalhes, obrigatorio } = req.body;

    // Buscar última versão
    const ultimaVersao = await TermVersion.findOne({
      order: [['numero', 'DESC']],
      transaction: t,
    });

    // Incrementar versão
    const novaNumero = incrementarVersao(ultimaVersao ? ultimaVersao.numero : null);

    // Criar nova versão
    const novaVersao = await TermVersion.create({
      numero: novaNumero,
    }, { transaction: t });

    // Clonar termos da última versão (se houver)
    let termosClonados = [];
    if (ultimaVersao) {
      const termosAntigos = await Term.findAll({
        where: { term_version_id: ultimaVersao.id },
        transaction: t,
      });

      termosClonados = termosAntigos.map(termo => ({
        nome: termo.nome,
        detalhes: termo.detalhes,
        obrigatorio: termo.obrigatorio,
        term_version_id: novaVersao.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await Term.bulkCreate(termosClonados, { transaction: t });
    }

    // Criar novo termo
    const novoTermo = await Term.create({
      nome,
      detalhes,
      obrigatorio,
      term_version_id: novaVersao.id,
    }, { transaction: t });

    // Buscar todos os termos obrigatórios da nova versão (clonados + novo)
    const termosObrigatorios = await Term.findAll({
      where: {
        term_version_id: novaVersao.id,
        obrigatorio: true,
      },
      transaction: t,
    });

    // Buscar todos os usuários
    const usuarios = await db.User.findAll({ transaction: t });

    // Gerar lista de aceites automáticos
    const aceites = [];

    for (const usuario of usuarios) {
      for (const termo of termosObrigatorios) {
        aceites.push({
          user_id: usuario.id,
          term_id: termo.id,
          aceito_em: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Inserir aceites em massa
    if (aceites.length > 0) {
      await UserTerm.bulkCreate(aceites, {
        transaction: t,
        ignoreDuplicates: true, // Evita erros caso já existam registros
      });
    }

    await t.commit();
    res.status(201).json(novoTermo);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};




// Busca termos aceitos por usuário
exports.getUserTerms = async (req, res) => {
  const userId = req.user.id;

  try {
    const records = await UserTerm.findAll({
      where: { user_id: userId },
      attributes: ['term_id', 'aceito_em'],
      raw: true,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Busca termos com status (aceito/não aceito) do usuário
exports.getTermsWithUserStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const ultimaVersao = await TermVersion.findOne({
      order: [['numero', 'DESC']],
    });

    if (!ultimaVersao) {
      return res.json([]);
    }

    const terms = await Term.findAll({
      where: { term_version_id: ultimaVersao.id },
      attributes: ['id', 'nome', 'detalhes', 'obrigatorio'],
      raw: true,
    });

    const userTerms = await UserTerm.findAll({
      where: { user_id: userId },
      attributes: ['term_id', 'aceito_em'],
      raw: true,
    });

    const userTermsMap = {};
    userTerms.forEach(ut => {
      userTermsMap[ut.term_id] = ut.aceito_em;
    });

    const result = terms.map(term => ({
      id: term.id,
      nome: term.nome,
      detalhes: term.detalhes,
      obrigatorio: term.obrigatorio,
      aceito: !!userTermsMap[term.id],
      aceito_em: userTermsMap[term.id] || null,
    }));

    console.log('userId:', userId);
    console.log('ultimaVersao:', ultimaVersao);
    console.log('terms:', terms);
    console.log('userTerms:', userTerms);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Aceitar termo pelo usuário
exports.acceptTerm = async (req, res) => {
  const userId = req.user.id;
  const termId = parseInt(req.params.termId);

  try {
    await UserTerm.upsert({
      user_id: userId,
      term_id: termId,
      aceito_em: new Date(),
    });
    res.json({ message: 'Termo aceito com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Desmarcar aceite de termo, com verificação de obrigatório
exports.unacceptTerm = async (req, res) => {
  const userId = req.user.id;
  const termId = parseInt(req.params.termId);

  try {
    const term = await Term.findByPk(termId);
    if (term.obrigatorio) {
      return res.status(400).json({ error: 'Termo obrigatório não pode ser desmarcado' });
    }

    await UserTerm.destroy({
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

// Deletar termo
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

// Atualizar termo existente
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
