const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI
  || 'mongodb+srv://pedro092004:tKFjkxF7trA1MI3h@cluster0.j3lf194.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar no MongoDB Atlas:', err));

module.exports = mongoose;