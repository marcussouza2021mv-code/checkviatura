const express = require('express');
const cors    = require('cors');
const path    = require('path');
const crypto  = require('crypto');
const https   = require('https');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const BIN_ID      = '6a2c1f77da38895dfeb57148'; // dados principais
const BIN_SIG_ID  = '6a2cb778f5f4af5e29e9e355'; // assinaturas
const API_KEY     = '$2a$10$kDDWOTN5bSV1mLSlepmCO.jDEVAN4Am3UN52MgFRcX8lB3Nr/zeTO';

function hash(str) { return crypto.createHash('sha256').update(str).digest('hex'); }

function jsonbinGet(binId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.jsonbin.io',
      path: `/v3/b/${binId}`,
      method: 'GET',
      headers: { 'X-Master-Key': API_KEY, 'Content-Type': 'application/json' }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.message && !parsed.record) { reject(new Error(parsed.message)); return; }
          resolve(parsed.record);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function jsonbinPut(binId, data) {
  return new Promise((resolve, reject) => {
    const bodyBuffer = Buffer.from(JSON.stringify(data), 'utf8');
    const options = {
      hostname: 'api.jsonbin.io',
      path: `/v3/b/${binId}`,
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': bodyBuffer.length
      }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.message && !parsed.record) {
            console.error('JSONBin PUT error:', parsed.message, 'size:', Math.round(bodyBuffer.length/1024)+'KB');
            reject(new Error(parsed.message));
            return;
          }
          resolve(parsed);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

// ── DB PRINCIPAL (sem assinaturas) ──
async function readDB() {
  try {
    const d = await jsonbinGet(BIN_ID);
    if (!d.usuarios)   d.usuarios   = defaultDB().usuarios;
    if (!d.equipes)    d.equipes    = defaultDB().equipes;
    if (!d.viaturas)   d.viaturas   = defaultDB().viaturas;
    if (!d.checklists) d.checklists = [];
    if (!d.alertas)    d.alertas    = [];
    return d;
  } catch(e) {
    console.error('readDB error:', e.message);
    return defaultDB();
  }
}

async function writeDB(db) {
  try {
    // Remove assinaturas antes de salvar no bin principal
    const dbSemSig = JSON.parse(JSON.stringify(db));
    dbSemSig.checklists = dbSemSig.checklists.map(c => ({
      ...c,
      sigMotorista: c.sigMotorista ? 'SIM' : '',
      sigChefe: c.sigChefe ? 'SIM' : ''
    }));
    const size = Buffer.byteLength(JSON.stringify(dbSemSig), 'utf8');
    console.log('writeDB size:', Math.round(size/1024), 'KB');
    await jsonbinPut(BIN_ID, dbSemSig);
    console.log('writeDB OK');
  } catch(e) {
    console.error('writeDB error:', e.message);
    throw e;
  }
}

// ── BIN DE ASSINATURAS ──
async function readSigs() {
  try {
    const d = await jsonbinGet(BIN_SIG_ID);
    if (!d.assinaturas) d.assinaturas = [];
    return d;
  } catch(e) {
    console.error('readSigs error:', e.message);
    return { assinaturas: [] };
  }
}

async function writeSigs(sigs) {
  try {
    await jsonbinPut(BIN_SIG_ID, sigs);
    console.log('writeSigs OK');
  } catch(e) {
    console.error('writeSigs error:', e.message);
  }
}

async function getSig(checklistId) {
  try {
    const d = await readSigs();
    return d.assinaturas.find(s => String(s.id) === String(checklistId)) || null;
  } catch(e) { return null; }
}

async function saveSig(checklistId, sigMotorista, sigChefe) {
  try {
    const d = await readSigs();
    const idx = d.assinaturas.findIndex(s => String(s.id) === String(checklistId));
    const entry = { id: checklistId, sigMotorista: sigMotorista||'', sigChefe: sigChefe||'' };
    if (idx >= 0) d.assinaturas[idx] = entry;
    else d.assinaturas.push(entry);
    await writeSigs(d);
  } catch(e) {
    console.error('saveSig error:', e.message);
  }
}

function defaultDB() {
  return {
    usuarios: [
      { id: 1, nome: 'Gerente', login: 'admin', senha: hash('admin123'), role: 'admin' },
      { id: 2, nome: 'Chefe Alpha', login: 'chefe1', senha: hash('chefe123'), role: 'chefe', equipe_id: 1 }
    ],
    equipes: [
      { id: 1, nome: 'Equipe Alfa',    chefe: 'Cerqueira' },
      { id: 2, nome: 'Equipe Bravo',   chefe: 'Savio' },
      { id: 3, nome: 'Equipe Charlie', chefe: 'Cleber' },
      { id: 4, nome: 'Equipe Delta',   chefe: 'Douglas' }
    ],
    viaturas: [
      { id: 1, placa: 'CRS',      modelo: 'IVECO DAILY',      equipe_id: 1 },
      { id: 2, placa: 'DOSA 318', modelo: 'IVECO MAGIRUS X6', cci: '02', equipe_id: 2 },
      { id: 3, placa: 'AP-2',     modelo: 'FÊNIX',            cci: '03', equipe_id: 3 },
      { id: 4, placa: 'DOSA 371', modelo: 'IVECO MAGIRUS X6', cci: '01', equipe_id: 4 }
    ],
    checklists: [],
    alertas: []
  };
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

// ── HELPER: junta checklist com assinatura ──
async function enrichWithSig(checklists) {
  try {
    const sigs = await readSigs();
    return checklists.map(c => {
      const sig = sigs.assinaturas.find(s => String(s.id) === String(c.id));
      return {
        ...c,
        sigMotorista: sig ? sig.sigMotorista : '',
        sigChefe: sig ? sig.sigChefe : ''
      };
    });
  } catch(e) {
    return checklists;
  }
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

// CHECKLISTS PÚBLICO
app.get('/api/checklists/publico', async (req, res) => {
  try {
    const db = await readDB();
    const enriched = await enrichWithSig(db.checklists);
    res.json([...enriched].reverse());
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

app.get('/api/checklists/publico/:id', async (req, res) => {
  try {
    const db = await readDB();
    const c = db.checklists.find(c => String(c.id) === String(req.params.id));
    if (!c) return res.status(404).json({ erro: 'Não encontrado' });
    const sig = await getSig(c.id);
    res.json({ ...c, sigMotorista: sig?.sigMotorista||'', sigChefe: sig?.sigChefe||'' });
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

// CHECKLISTS AUTENTICADO
app.get('/api/checklists', requireAuth(), async (req, res) => {
  try {
    const db = await readDB();
    let data = [...db.checklists];
    if (req.query.mes) data = data.filter(c => c.data && c.data.startsWith(req.query.mes));
    if (req.query.viatura_id) {
      const placa = getViaturaPlacar(db, req.query.viatura_id);
      data = data.filter(c => c.viatura_id == req.query.viatura_id || c.placa === placa);
    }
    if (req.query.status) data = data.filter(c => c.status === req.query.status);
    if (req.query.equipe_id) {
      const eq = db.equipes.find(e => e.id == req.query.equipe_id);
      if (eq) {
        const nomeSimples  = eq.nome.replace('Equipe ', '');
        const nomeCompleto = eq.nome;
        data = data.filter(c =>
          c.equipe === nomeSimples ||
          c.equipe === nomeCompleto ||
          c.nome_chefe === eq.chefe ||
          c.equipe_id == req.query.equipe_id
        );
      }
    }
    const enriched = await enrichWithSig(data);
    res.json(enriched.reverse());
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

app.post('/api/checklists', async (req, res) => {
  try {
    const db = await readDB();
    const id = Date.now();
    const sigMotorista = req.body.sigMotorista || '';
    const sigChefe = req.body.sigChefe || '';
    const r = {
      id,
      ...req.body,
      sigMotorista: sigMotorista ? 'SIM' : '',
      sigChefe: sigChefe ? 'SIM' : ''
    };
    console.log('Salvando checklist:', r.formulario_id, r.preenchidoPor, r.equipe, r.nome);
    db.checklists.push(r);
    if (r.nc > 0) {
      db.alertas = db.alertas || [];
      db.alertas.push({
        id: Date.now()+1, tipo: 'nok',
        msg: `${r.nc} NC — ${r.placa} — ${r.nome} (${r.preenchidoPor==='nome_guerra_ba2'?'BA-2':'Motorista'})`,
        checklist_id: r.id, data: r.data, lido: false
      });
    }
    await writeDB(db);
    await saveSig(id, sigMotorista, sigChefe);
    console.log('Checklist salvo! Total:', db.checklists.length);
    res.json({ ...r, sigMotorista, sigChefe });
  } catch(e) {
    console.error('Erro ao salvar checklist:', e.message);
    res.status(500).json({ erro: e.message });
  }
});

app.delete('/api/checklists/:id', requireAuth(['admin','chefe']), async (req, res) => {
  try {
    const db = await readDB();
    db.checklists = db.checklists.filter(c => c.id != req.params.id);
    await writeDB(db);
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

app.post('/api/checklists/:id/aprovar', async (req, res) => {
  try {
    const db = await readDB();
    const idx = db.checklists.findIndex(c => String(c.id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ erro: 'Não encontrado' });
    const sigChefe = req.body.sigChefe || '';
    db.checklists[idx] = {
      ...db.checklists[idx],
      ...req.body,
      sigChefe: sigChefe ? 'SIM' : ''
    };
    await writeDB(db);
    // Atualiza assinatura do chefe no bin de assinaturas
    const sigAtual = await getSig(req.params.id);
    await saveSig(req.params.id, sigAtual?.sigMotorista||'', sigChefe);
    res.json({ ...db.checklists[idx], sigChefe });
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

// ALERTAS
app.get('/api/alertas', requireAuth(['admin','chefe']), async (req, res) => {
  try {
    const db = await readDB();
    res.json((db.alertas||[]).filter(a=>!a.lido).reverse().slice(0,50));
  } catch(e) { res.status(500).json({ erro: e.message }); }
});
app.put('/api/alertas/:id/lido', requireAuth(['admin','chefe']), async (req, res) => {
  try {
    const db = await readDB();
    const a = (db.alertas||[]).find(x=>x.id==req.params.id);
    if (a) { a.lido=true; await writeDB(db); }
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ erro: e.message }); }
});
app.put('/api/alertas/lidos/todos', requireAuth(['admin','chefe']), async (req, res) => {
  try {
    const db = await readDB();
    (db.alertas||[]).forEach(a=>a.lido=true);
    await writeDB(db);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ erro: e.message }); }
});

// DASHBOARD
app.get('/api/dashboard', requireAuth(['admin','chefe']), async (req, res) => {
  try {
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
        c.equipe === e.nome ||
        c.nome_chefe === e.chefe
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
  } catch(e) { res.status(500).json({ erro: e.message }); }
});

// EXPORT CSV
app.get('/api/export/csv', requireAuth(), async (req, res) => {
  try {
    const db = await readDB();
    let data = [...db.checklists];
    if (req.query.mes) data = data.filter(c=>c.data&&c.data.startsWith(req.query.mes));
    data.sort((a,b)=>a.data>b.data?1:-1);
    const header=['ID','Data','Placa','Modelo','Tipo','Equipe','Nome','Status','NC','Observacao'];
    const rows=data.map(c=>[
      c.id, c.data, c.placa, c.modelo||'',
      c.preenchidoPor==='nome_guerra_ba2'?'BA-2':c.preenchidoPor==='lider_resgate'?'Líder':'Motorista',
      c.equipe, c.nome||c.motorista||'',
      c.status, c.nc||0, (c.obs||'').replace(/,/g,';')
    ]);
    const csv='\uFEFF'+[header,...rows].map(r=>r.join(',')).join('\n');
    res.setHeader('Content-Type','text/csv; charset=utf-8');
    res.setHeader('Content-Disposition','attachment; filename="checklists.csv"');
    res.send(csv);
  } catch(e) { res.status(500).json({ erro: e.message }); }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ CheckViatura em http://localhost:${PORT}`));
