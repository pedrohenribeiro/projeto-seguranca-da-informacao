// restore_last_backup.js
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const BACKUP_DIR = path.join(__dirname, 'backups-mysql');
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs }))
    .sort((a, b) => b.time - a.time);

  if (!files.length) {
    console.error('Nenhum backup .sql encontrado em', BACKUP_DIR);
    process.exit(1);
  }

  const latestFile = path.join(BACKUP_DIR, files[0].name);
  console.log('Usando dump:', files[0].name);

  // Conecta no Mongo e pega inativos
  const mongoClient = new MongoClient(process.env.MONGO_URI);
  await mongoClient.connect();
  const docs = await mongoClient.db().collection('usuarioInativos')
    .find({}, { projection: { userId: 1, _id: 0 } })
    .toArray();
  const inativos = new Set(docs.map(d => d.userId));
  console.log('IDs inativos no Mongo:', Array.from(inativos));
  await mongoClient.close();

  // Filtra INSERTs na tabela `users`
  const dumpLines = fs.readFileSync(latestFile, 'utf8').split('\n');
  const filtered = dumpLines.filter(line => {
    if (line.startsWith('INSERT INTO `users`') || line.startsWith('INSERT INTO users')) {
      return line
        .replace(/\r$/, '')
        .split(/\),\(/g)
        .some(tuple => {
          const clean = tuple.replace(/^\(?|\)?;?$/g, '');
          const id = parseInt(clean.split(',')[0].replace(/\D/g, ''), 10);
          return !inativos.has(id);
        });
    }
    return true;
  });

  // Grava dump limpo num arquivo temporário
  const tempFile = latestFile + '.clean.sql';
  fs.writeFileSync(tempFile, filtered.join('\n'));
  console.log('Dump filtrado escrito em', tempFile);

  // Importa no MySQL
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  console.log('Importando dump para o MySQL...');
  const sql = fs.readFileSync(tempFile, 'utf8');
  await conn.query(sql);

  // Ajusta AUTO_INCREMENT para não reusar IDs inativos
  const maxInativo = Math.max(...Array.from(inativos), 0);
  const nextAI = maxInativo + 1;
  console.log(`Ajustando AUTO_INCREMENT para ${nextAI}`);
  await conn.query(`ALTER TABLE users AUTO_INCREMENT = ${nextAI};`);

  console.log('Restauração concluída com sucesso.');
  await conn.end();
})();
