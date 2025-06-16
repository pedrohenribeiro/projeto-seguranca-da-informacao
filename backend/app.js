const express = require('express');
const path = require('path');
const cors = require('cors');
require('./config/mongo');
require('dotenv').config();

const db = require('./models');
const sequelize = db.sequelize;

const userRoutes = require('./routes/routes');
const oauthRoutes = require('./routes/oauthRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', userRoutes);
app.use('/oauth', oauthRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com MySQL estabelecida com sucesso.');

    return sequelize.sync();
  })
  .then(() => {
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
  })
  .catch(err => {
    console.error('Erro ao conectar com o MySQL:', err);
  });
