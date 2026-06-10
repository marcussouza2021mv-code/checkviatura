const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── banco de dados em JSON ──────────────────────────────────────────────
const DB_FILE = path.join(__dirname, 'data.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) return defaultDB();
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return defaultDB(); }
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function defaultDB() {
  return {
    equipes: [
      { id: 1, nome: 'Equipe Alpha', chefe: 'Carlos Souza' },
      { id: 2, nome: 'Equipe Beta',  chefe: 'Mariana Lima'  }
    ],
    viaturas: [
      { id: 1, placa: 'ABC-1234', modelo: 'Ford Ranger',    equipe_id: 1 },
      { id: 2, placa: 'DEF-5678', modelo: 'Fiat Ducato',    equipe_id: 1 },
      { id: 3, placa: 'GHI-9012', modelo: 'Chevrolet S10',  equipe_id: 2 },
      { id: 4, placa: 'JKL-3456', modelo: 'Toyota Hilux',   equipe_id: 2 }
    ],
    checklists: []
  };
}

// inicializa se não existir
if (!fs.existsSync(DB_FILE)) writeDB(defaultDB());

// ── EQUIPES ────────────────────────────────────────────────────────────
app.get('/api/equipes', (req, res) => {
  res.json(readDB().equipes);
});
app.post('/api/equipes', (req, res) => {
  const db = readDB();
  const equipe = { id: Date.now(), ...req.body };
  db.equipes.push(equipe);
  writeDB(db);
  res.json(equipe);
});
app.delete('/api/equipes/:id', (req, res) => {
  const db = readDB();
  db.equipes = db.equipes.filter(e => e.id != req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

// ── VIATURAS ───────────────────────────────────────────────────────────
app.get('/api/viaturas', (req, res) => {
  res.json(readDB().viaturas);
});
app.post('/api/viaturas', (req, res) => {
  const db = readDB();
  const viatura = { id: Date.now(), ...req.body };
  db.viaturas.push(viatura);
  writeDB(db);
  res.json(viatura);
});
app.delete('/api/viaturas/:id', (req, res) => {
  const db = readDB();
  db.viaturas = db.viaturas.filter(v => v.id != req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

// ── CHECKLISTS ─────────────────────────────────────────────────────────
app.get('/api/checklists', (req, res) => {
  const db = readDB();
  let data = [...db.checklists];
  if (req.query.mes)    data = data.filter(c => c.data && c.data.startsWith(req.query.mes));
  if (req.query.viatura_id) data = data.filter(c => c.viatura_id == req.query.viatura_id);
  if (req.query.status) data = data.filter(c => c.status === req.query.status);
  res.json(data.reverse());
});
app.post('/api/checklists', (req, res) => {
  const db = readDB();
  const registro = { id: Date.now(), ...req.body };
  db.checklists.push(registro);
  writeDB(db);
  res.json(registro);
});
app.delete('/api/checklists/:id', (req, res) => {
  const db = readDB();
  db.checklists = db.checklists.filter(c => c.id != req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

// ── EXPORT CSV ─────────────────────────────────────────────────────────
app.get('/api/export/csv', (req, res) => {
  const db = readDB();
  let data = [...db.checklists];
  if (req.query.mes)    data = data.filter(c => c.data && c.data.startsWith(req.query.mes));
  if (req.query.viatura_id) data = data.filter(c => c.viatura_id == req.query.viatura_id);
  data.sort((a,b) => a.data > b.data ? 1 : -1);

  const header = ['ID','Data','Placa','Modelo','Equipe','Motorista','CPF','KM','Status','Pendencias','Observacao'];
  const rows = data.map(c => [
    c.id, c.data, c.placa, c.modelo, c.equipe, c.motorista, c.cpf||'', c.km||'',
    c.status, c.nok||0, (c.obs||'').replace(/,/g,';')
  ]);
  const csv = '\uFEFF' + [header, ...rows].map(r => r.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="checklists.csv"');
  res.send(csv);
});

// ── START ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ CheckViatura rodando em http://localhost:${PORT}`);
});
