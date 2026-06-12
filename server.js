const express = require('express');
const cors    = require('cors');
const path    = require('path');
const crypto  = require('crypto');
const https   = require('https');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const BIN_ID  = '6a2c1f77da38895dfeb57148';
const API_KEY = '$2a$10$kDDWOTN5bSV1mLSlepmCO.jDEVAN4Am3UN52MgFRcX8lB3Nr/zeTO';

function hash(str) { return crypto.createHash('sha256').update(str).digest('hex'); }

function jsonbinRequest(method, data=null) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'api.jsonbin.io',
      path: `/v3/b/${BIN_ID}`,
      method,
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
      }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve(method === 'GET' ? parsed.record : parsed);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function readDB() {
  try {
    const d = await jsonbinRequest('GET');
    if (!d.usuarios)   d.usuarios   = [];
    if (!d.equipes)    d.equipes    = [];
    if (!d.viaturas)   d.viaturas   = [];
    if (!d.checklists) d.checklists = [];
    if (!d.alertas)    d.alertas    = [];
    return d;
  } catch(e) {
    console.error('readDB error:', e.message);
    return { usuarios:[], equipes:[], viaturas:[], checklists:[], alertas:[] };
  }
}

async function writeDB(db) {
  try {
    await jsonbinRequest('PUT', db);
  } catch(e) {
    console.error('writeDB error:', e.message);
  }
}

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

function getEquipeNome(db, id) {
  const e = db.equipes.find(e => e.id == id);
  return e ? e.nome.replace('Equipe ', '') : '';
}
function getViaturaPlacar(db, id) {
  const v = db.viaturas.find(v => v.id == id);
  return v ? v.placa : '';
}

// AUTH
app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, senha } = req.body;
    const db = await readDB();
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
app.get('/api/usuarios', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  res.json(db.usuarios.map(u => ({ ...u, senha: undefined })));
});
app.post('/api/usuarios', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  if (db.usuarios.find(u => u.login === req.body.login))
    return res.status(400).json({ erro: 'Login já existe' });
  const u = { id: Date.now(), ...req.body, senha: hash(req.body.senha) };
  db.usuarios.push(u); await writeDB(db);
  res.json({ ...u, senha: undefined });
});
app.put('/api/usuarios/:id', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  const idx = db.usuarios.findIndex(u => u.id == req.params.id);
  if (idx === -1) return res.status(404).json({ erro: 'Não encontrado' });
  const upd = { ...db.usuarios[idx], ...req.body };
  if (req.body.senha) upd.senha = hash(req.body.senha);
  db.usuarios[idx] = upd; await writeDB(db);
  res.json({ ...upd, senha: undefined });
});
app.delete('/api/usuarios/:id', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  db.usuarios = db.usuarios.filter(u => u.id != req.params.id);
  await writeDB(db); res.json({ ok: true });
});

// EQUIPES
app.get('/api/equipes', async (req, res) => res.json((await readDB()).equipes));
app.post('/api/equipes', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  const e = { id: Date.now(), ...req.body };
  db.equipes.push(e); await writeDB(db); res.json(e);
});
app.put('/api/equipes/:id', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  const idx = db.equipes.findIndex(e => e.id == req.params.id);
  if (idx === -1) return res.status(404).json({ erro: 'Não encontrado' });
  db.equipes[idx] = { ...db.equipes[idx], ...req.body };
  await writeDB(db); res.json(db.equipes[idx]);
});
app.delete('/api/equipes/:id', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  db.equipes = db.equipes.filter(e => e.id != req.params.id);
  await writeDB(db); res.json({ ok: true });
});

// VIATURAS
app.get('/api/viaturas', async (req, res) => res.json((await readDB()).viaturas));
app.post('/api/viaturas', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  const v = { id: Date.now(), ...req.body };
  db.viaturas.push(v); await writeDB(db); res.json(v);
});
app.put('/api/viaturas/:id', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  const idx = db.viaturas.findIndex(v => v.id == req.params.id);
  if (idx === -1) return res.status(404).json({ erro: 'Não encontrado' });
  db.viaturas[idx] = { ...db.viaturas[idx], ...req.body };
  await writeDB(db); res.json(db.viaturas[idx]);
});
app.delete('/api/viaturas/:id', requireAuth(['admin']), async (req, res) => {
  const db = await readDB();
  db.viaturas = db.viaturas.filter(v => v.id != req.params.id);
  await writeDB(db); res.json({ ok: true });
});

// CHECKLISTS PÚBLICO (chefe)
app.get('/api/checklists/publico', async (req, res) => {
  const db = await readDB();
  let data = [...db.checklists];
  if (req.query.equipe) data = data.filter(c => c.equipe === req.query.equipe);
  res.json(data.reverse());
});

app.get('/api/checklists/publico/:id', async (req, res) => {
  const db = await readDB();
  const c = db.checklists.find(c => String(c.id) === String(req.params.id));
  if (!c) return res.status(404).json({ erro: 'Não encontrado' });
  res.json(c);
});

// CHECKLISTS (autenticado)
app.get('/api/checklists', requireAuth(), async (req, res) => {
  const db = await readDB();
  let data = [...db.checklists];
  if (req.query.mes) data = data.filter(c => c.data && c.data.startsWith(req.query.mes));
  if (req.query.viatura_id) {
    const placa = getViaturaPlacar(db, req.query.viatura_id);
    data = data.filter(c => c.viatura_id == req.query.viatura_id || c.placa === placa);
  }
  if (req.query.status) data = data.filter(c => c.status === req.query.status);
  if (req.query.equipe_id) {
    const nomeEquipe = getEquipeNome(db, req.query.equipe_id);
    data = data.filter(c =>
      c.equipe_id == req.query.equipe_id ||
      c.equipe === nomeEquipe ||
      c.equipe === 'Equipe ' + nomeEquipe
    );
  }
  res.json(data.reverse());
});

app.post('/api/checklists', async (req, res) => {
  const db = await readDB();
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
  await writeDB(db); res.json(r);
});

app.delete('/api/checklists/:id', requireAuth(['admin','chefe']), async (req, res) => {
  const db = await readDB();
  db.checklists = db.checklists.filter(c => c.id != req.params.id);
  await writeDB(db); res.json({ ok: true });
});

app.post('/api/checklists/:id/aprovar', async (req, res) => {
  const db = await readDB();
  const idx = db.checklists.findIndex(c => String(c.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ erro: 'Não encontrado' });
  db.checklists[idx] = { ...db.checklists[idx], ...req.body };
  await writeDB(db);
  res.json(db.checklists[idx]);
});

// ALERTAS
app.get('/api/alertas', requireAuth(['admin','chefe']), async (req, res) => {
  const db = await readDB();
  res.json((db.alertas||[]).filter(a=>!a.lido).reverse().slice(0,50));
});
app.put('/api/alertas/:id/lido', requireAuth(['admin','chefe']), async (req, res) => {
  const db = await readDB();
  const a = (db.alertas||[]).find(x=>x.id==req.params.id);
  if (a) { a.lido=true; await writeDB(db); }
  res.json({ ok: true });
});
app.put('/api/alertas/lidos/todos', requireAuth(['admin','chefe']), async (req, res) => {
  const db = await readDB();
  (db.alertas||[]).forEach(a=>a.lido=true);
  await writeDB(db); res.json({ ok: true });
});

// DASHBOARD
app.get('/api/dashboard', requireAuth(['admin','chefe']), async (req, res) => {
  const db = await readDB();
  const mes = req.query.mes || new Date().toISOString().slice(0,7);
  const cls = db.checklists.filter(c => c.data && c.data.startsWith(mes));
  const porViatura = db.viaturas.map(v => {
    const myCls = cls.filter(c => c.viatura_id == v.id || c.placa == v.placa);
    const nok = myCls.filter(c=>c.status==='nok').length;
    const eq = db.equipes.find(e=>e.id==v.equipe_id)||{};
    return { ...v, equipe: eq.nome||'—', total: myCls.length, ok: myCls.length-nok, nok };
  });
  const porEquipe = db.equipes.map(e => {
    const nomeSimples = e.nome.replace('Equipe ','');
    const myCls = cls.filter(c =>
      c.equipe_id == e.id ||
      c.equipe === nomeSimples ||
      c.equipe === e.nome
    );
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
app.get('/api/export/csv', requireAuth(), async (req, res) => {
  const db = await readDB();
  let data = [...db.checklists];
  if (req.query.mes) data = data.filter(c=>c.data&&c.data.startsWith(req.query.mes));
  if (req.query.viatura_id) data = data.filter(c=>c.viatura_id==req.query.viatura_id||c.placa==getViaturaPlacar(db,req.query.viatura_id));
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
