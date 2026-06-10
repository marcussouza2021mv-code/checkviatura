const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'data.json');

function hash(str) { return crypto.createHash('sha256').update(str).digest('hex'); }

function defaultDB() {
  return {
    usuarios: [
      { id: 1, nome: 'Gerente', login: 'admin', senha: hash('admin123'), role: 'admin' },
      { id: 2, nome: 'Chefe Alpha', login: 'chefe1', senha: hash('chefe123'), role: 'chefe', equipe_id: 1 }
    ],
    equipes: [
      { id: 1, nome: 'Equipe Alpha', chefe: 'Carlos Souza' },
      { id: 2, nome: 'Equipe Beta',  chefe: 'Mariana Lima'  }
    ],
    viaturas: [
      { id: 1, placa: 'CRS',      modelo: 'IVECO DAILY',      equipe_id: 1 },
      { id: 2, placa: 'DOSA 318', modelo: 'IVECO MAGIRUS X6', equipe_id: 1 },
      { id: 3, placa: 'AP-2',     modelo: 'FENIX',            equipe_id: 2 },
      { id: 4, placa: 'DOSA 371', modelo: 'IVECO MAGIRUS X6', equipe_id: 2 }
    ],
    checklists: [],
    alertas: []
  };
}

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const d = defaultDB();
      fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2));
      return d;
    }
    const d = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (!d || !d.usuarios) {
      const def = defaultDB();
      fs.writeFileSync(DB_FILE, JSON.stringify(def, null, 2));
      return def;
    }
    return d;
  } catch(e) {
    const def = defaultDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(def, null, 2));
    return def;
  }
}

function writeDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

// init
readDB();

// SESSOES
const sessions = {};
function newSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions[token] = { ...user, ts: Date.now() };
  return token;
}
function getSession(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  const s = sessions[token];
  if (!s) return null;
  if (Date.now() - s.ts > 8 * 60 * 60 * 1000) { delete sessions[token]; return null; }
  s.ts = Date.now();
  return s;
}
function requireAuth(roles=[]) {
  return (req, res, next) => {
    const s = getSession(req);
    if (!s) return res.status(401).json({ erro: 'Não autenticado' });
    if (roles.length && !roles.includes(s.role)) return res.status(403).json({ erro: 'Sem permissão' });
    req.user = s;
    next();
  };
}

// AUTH
app.post('/api/auth/login', (req, res) => {
  try {
    const { login, senha } = req.body;
    const db = readDB();
    const u = db.usuarios.find(x => x.login === login && x.senha === hash(senha));
    if (!u) return res.status(401).json({ erro: 'Login ou senha incorretos' });
    const token = newSession(u);
    res.json({ token, nome: u.nome, role: u.role, equipe_id: u.equipe_id });
  } catch(e) { res.status(500).json({ erro: e.message }); }
});

app.post('/api/auth/logout', (req, res) => {
  const auth = req.headers.authorization || '';
  delete sessions[auth.replace('Bearer ', '')];
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth(), (req, res) => {
  res.json({ nome: req.user.nome, role: req.user.role, equipe_id: req.user.equipe_id });
});

// USUARIOS
app.get('/api/usuarios', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  res.json(db.usuarios.map(u => ({ ...u, senha: undefined })));
});
app.post('/api/usuarios', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  if (db.usuarios.find(u => u.login === req.body.login))
    return res.status(400).json({ erro: 'Login já existe' });
  const u = { id: Date.now(), ...req.body, senha: hash(req.body.senha) };
  db.usuarios.push(u); writeDB(db);
  res.json({ ...u, senha: undefined });
});
app.put('/api/usuarios/:id', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  const idx = db.usuarios.findIndex(u => u.id == req.params.id);
  if (idx === -1) return res.status(404).json({ erro: 'Não encontrado' });
  const upd = { ...db.usuarios[idx], ...req.body };
  if (req.body.senha) upd.senha = hash(req.body.senha);
  db.usuarios[idx] = upd; writeDB(db);
  res.json({ ...upd, senha: undefined });
});
app.delete('/api/usuarios/:id', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  db.usuarios = db.usuarios.filter(u => u.id != req.params.id);
  writeDB(db); res.json({ ok: true });
});

// EQUIPES
app.get('/api/equipes', (req, res) => res.json(readDB().equipes));
app.post('/api/equipes', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  const e = { id: Date.now(), ...req.body };
  db.equipes.push(e); writeDB(db); res.json(e);
});
app.put('/api/equipes/:id', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  const idx = db.equipes.findIndex(e => e.id == req.params.id);
  if (idx === -1) return res.status(404).json({ erro: 'Não encontrado' });
  db.equipes[idx] = { ...db.equipes[idx], ...req.body };
  writeDB(db); res.json(db.equipes[idx]);
});
app.delete('/api/equipes/:id', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  db.equipes = db.equipes.filter(e => e.id != req.params.id);
  writeDB(db); res.json({ ok: true });
});

// VIATURAS
app.get('/api/viaturas', (req, res) => res.json(readDB().viaturas));
app.post('/api/viaturas', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  const v = { id: Date.now(), ...req.body };
  db.viaturas.push(v); writeDB(db); res.json(v);
});
app.put('/api/viaturas/:id', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  const idx = db.viaturas.findIndex(v => v.id == req.params.id);
  if (idx === -1) return res.status(404).json({ erro: 'Não encontrado' });
  db.viaturas[idx] = { ...db.viaturas[idx], ...req.body };
  writeDB(db); res.json(db.viaturas[idx]);
});
app.delete('/api/viaturas/:id', requireAuth(['admin']), (req, res) => {
  const db = readDB();
  db.viaturas = db.viaturas.filter(v => v.id != req.params.id);
  writeDB(db); res.json({ ok: true });
});

// CHECKLISTS
app.get('/api/checklists', requireAuth(), (req, res) => {
  const db = readDB();
  let data = [...db.checklists];
  if (req.query.mes)        data = data.filter(c => c.data && c.data.startsWith(req.query.mes));
  if (req.query.viatura_id) data = data.filter(c => c.viatura_id == req.query.viatura_id);
  if (req.query.status)     data = data.filter(c => c.status === req.query.status);
  if (req.query.equipe_id)  data = data.filter(c => c.equipe_id == req.query.equipe_id);
  res.json(data.reverse());
});
app.post('/api/checklists', (req, res) => {
  const db = readDB();
  const r = { id: Date.now(), ...req.body };
  db.checklists.push(r);
  if (r.nc > 0) {
    db.alertas = db.alertas || [];
    db.alertas.push({
      id: Date.now()+1, tipo: 'nok',
      msg: `${r.nc} pendência(s) na viatura ${r.placa} — ${r.nome||r.motorista}`,
      checklist_id: r.id, data: r.data, lido: false
    });
  }
  writeDB(db); res.json(r);
});
app.delete('/api/checklists/:id', requireAuth(['admin','chefe']), (req, res) => {
  const db = readDB();
  db.checklists = db.checklists.filter(c => c.id != req.params.id);
  writeDB(db); res.json({ ok: true });
});

// ALERTAS
app.get('/api/alertas', requireAuth(['admin','chefe']), (req, res) => {
  const db = readDB();
  res.json((db.alertas||[]).filter(a=>!a.lido).reverse().slice(0,50));
});
app.put('/api/alertas/:id/lido', requireAuth(['admin','chefe']), (req, res) => {
  const db = readDB();
  const a = (db.alertas||[]).find(x=>x.id==req.params.id);
  if (a) { a.lido=true; writeDB(db); }
  res.json({ ok: true });
});
app.put('/api/alertas/lidos/todos', requireAuth(['admin','chefe']), (req, res) => {
  const db = readDB();
  (db.alertas||[]).forEach(a=>a.lido=true);
  writeDB(db); res.json({ ok: true });
});

// DASHBOARD
app.get('/api/dashboard', requireAuth(['admin','chefe']), (req, res) => {
  const db = readDB();
  const mes = req.query.mes || new Date().toISOString().slice(0,7);
  const cls = db.checklists.filter(c => c.data && c.data.startsWith(mes));
  const porViatura = db.viaturas.map(v => {
    const myCls = cls.filter(c => c.viatura_id == v.id || c.placa == v.placa);
    const nok = myCls.filter(c=>c.status==='nok').length;
    const eq = db.equipes.find(e=>e.id==v.equipe_id)||{};
    return { ...v, equipe: eq.nome||'—', total: myCls.length, ok: myCls.length-nok, nok };
  });
  const porEquipe = db.equipes.map(e => {
    const myCls = cls.filter(c=>c.equipe_id==e.id);
    const nok = myCls.filter(c=>c.status==='nok').length;
    return { ...e, total: myCls.length, ok: myCls.length-nok, nok };
  });
  const hoje = new Date();
  const porDia = [];
  for (let i=6;i>=0;i--) {
    const d=new Date(hoje); d.setDate(d.getDate()-i);
    const key=d.toISOString().slice(0,10);
    const dc=cls.filter(c=>c.data&&c.data.startsWith(key));
    porDia.push({dia:key.slice(5),total:dc.length,nok:dc.filter(c=>c.status==='nok').length});
  }
  const motMap={};
  cls.forEach(c=>{
    const n=c.nome||c.motorista||'—';
    if(!motMap[n]) motMap[n]={nome:n,total:0,nok:0};
    motMap[n].total++;
    if(c.status==='nok') motMap[n].nok++;
  });
  res.json({
    mes, total:cls.length,
    ok:cls.filter(c=>c.status==='ok').length,
    nok:cls.filter(c=>c.status==='nok').length,
    alertas:(db.alertas||[]).filter(a=>!a.lido).length,
    porViatura, porEquipe, porDia,
    motoristas:Object.values(motMap).sort((a,b)=>b.total-a.total)
  });
});

// EXPORT CSV
app.get('/api/export/csv', requireAuth(), (req, res) => {
  const db = readDB();
  let data = [...db.checklists];
  if (req.query.mes) data = data.filter(c=>c.data&&c.data.startsWith(req.query.mes));
  if (req.query.viatura_id) data = data.filter(c=>c.viatura_id==req.query.viatura_id);
  data.sort((a,b)=>a.data>b.data?1:-1);
  const header=['ID','Data','Placa','Modelo','Equipe','Nome','CPF','KM','Status','Pendencias','Observacao'];
  const rows=data.map(c=>[c.id,c.data,c.placa,c.modelo,c.equipe,c.nome||c.motorista||'',c.cpf||'',c.km||'',c.status,c.nc||c.nok||0,(c.obs||'').replace(/,/g,';')]);
  const csv='\uFEFF'+[header,...rows].map(r=>r.join(',')).join('\n');
  res.setHeader('Content-Type','text/csv; charset=utf-8');
  res.setHeader('Content-Disposition','attachment; filename="checklists.csv"');
  res.send(csv);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ CheckViatura em http://localhost:${PORT}`));
