const express = require('express');
const app = express();
const sequelize = require('./config/db');
const userRoutes = require('./routes/routes');
const cors = require('cors');
require('./config/mongo');
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/api', userRoutes);

sequelize.sync().then(() => {
    sequelize.authenticate()
  .then(() => console.log('Conexão com MySQL estabelecida com sucesso.'))
  .catch(err => console.error('Erro ao conectar com o MySQL:', err));

  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});
