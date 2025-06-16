const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const BACKUP_DIR = path.join(__dirname, 'backups-mysql');
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({ name: f, mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  if (!files.length) {
    console.error('Nenhum backup .sql encontrado em', BACKUP_DIR);
    process.exit(1);
  }

  const latestFile = path.join(BACKUP_DIR, files[0].name);
  console.log('Usando dump:', files[0].name);

  const mongoClient = new MongoClient(process.env.MONGO_URI);
  await mongoClient.connect();
  const docs = await mongoClient.db()
    .collection('usuarioInativos')
    .find({}, { projection: { userId: 1, _id: 0 } })
    .toArray();
  const inativos = new Set(docs.map(d => d.userId));
  console.log('IDs inativos no Mongo:', Array.from(inativos));
  await mongoClient.close();

  const lines = fs.readFileSync(latestFile, 'utf8').split('\n');
  const output = [];

  for (let line of lines) {
    if (line.match(/^INSERT INTO [`]?users[`]?/i)) {
      const [prefix, rest] = line.split(/VALUES/i);
      if (!rest) {
        output.push(line);
        continue;
      }
      const header = prefix + 'VALUES';
      const tuples = rest.trim().replace(/;$/, '').slice(1, -1).split(/\),\(/);
      const kept = tuples.filter(t => {
        const id = parseInt(t.split(',')[0].replace(/\D/g, ''), 10);
        return !inativos.has(id);
      });
      if (kept.length > 0) {

        output.push(`${header} (${kept.join('),(')});`);
      } else {

      }
    } else {
      output.push(line);
    }
  }

  const cleanFile = latestFile.replace(/\.sql$/, '.filtered.sql');
  fs.writeFileSync(cleanFile, output.join('\n'));
  console.log('Dump filtrado escrito em', cleanFile);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true
  });

  console.log('Importando dump para o MySQL...');
  const sql = fs.readFileSync(cleanFile, 'utf8');
  await conn.query(sql);

  const maxInativo = Math.max(...Array.from(inativos), 0);
  const nextAI = maxInativo + 1;
  console.log(`Ajustando AUTO_INCREMENT para ${nextAI}`);
  await conn.query(`ALTER TABLE users AUTO_INCREMENT = ${nextAI};`);

  console.log('Restauração concluída com sucesso.');
  await conn.end();
})();
