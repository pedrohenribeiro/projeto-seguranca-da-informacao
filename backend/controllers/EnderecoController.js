const { validationResult } = require('express-validator');
const Address = require('../models/Endereco');

module.exports = {
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { id: userId } = req.user;
      const data = { ...req.body, userId };
      const address = await Address.create(data);
      res.status(201).json(address);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getMyAddress(req, res) {
    try {
      const address = await Address.findOne({ where: { userId: req.user.id } });
      if (!address) return res.status(404).json({ error: 'Endereço não encontrado' });
      res.json(address);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateMyAddress(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const address = await Address.findOne({ where: { userId: req.user.id } });
      if (!address) return res.status(404).json({ error: 'Endereço não encontrado' });

      await address.update(req.body);
      res.json(address);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteMyAddress(req, res) {
    try {
      const address = await Address.findOne({ where: { userId: req.user.id } });
      if (!address) return res.status(404).json({ error: 'Endereço não encontrado' });

      await address.destroy();
      res.json({ message: 'Endereço deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
