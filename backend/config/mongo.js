// config/mongo.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI
  || 'mongodb+srv://pedrohribeiro200409:I15cuqyZHYjdgOrm@cluster0.nfqctl6.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar no MongoDB Atlas:', err));

module.exports = mongoose;
