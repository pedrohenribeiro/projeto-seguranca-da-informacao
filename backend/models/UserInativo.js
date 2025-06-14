const mongoose = require('mongoose');

const userInativoSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    inativadoEm: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'usuarioInativos',
  }
);

module.exports = mongoose.model('UserInativo', userInativoSchema);
