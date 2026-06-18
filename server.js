const express = require('express');
const cors    = require('cors');
const path    = require('path');
const crypto  = require('crypto');
const https   = require('https');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const SUPA_URL    = 'https://qwzvnvmcwdnvopehwnee.supabase.co';
const SUPA_KEY    = 'sb_secret_nLndfLmW-BfqWtx3AZOfRw_CoMo9QOW';
const CLOUD_NAME   = 'drj7tagld';
const CLOUD_KEY    = '824487421874555';
const CLOUD_SECRET = 'gWdHK5gEkxLEnPmun91kcboGugs';

function hash(str) { return crypto.createHash('sha256').update(str).digest('hex'); }

function supaFetch(method, table, body=null, query='') {
  return new Promise((resolve, reject) => {
    const bodyBuf = body ? Buffer.from(JSON.stringify(body), 'utf8') : null;
    const options = {
      hostname: 'qwzvnvmcwdnvopehwnee.supabase.co',
      path: `/rest/v1/${table}${query}`,
      method,
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(bodyBuf ? { 'Content-Length': bodyBuf.length } : {})
      }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          const parsed = raw ? JSON.parse(raw) : [];
          if (res.statusCode >= 400) {
            console.error('Supabase error:', res.statusCode, raw.slice(0,200));
            reject(new Error(parsed.message || raw.slice(0,100)));
            return;
          }
          resolve(parsed);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

// ✅ Registra histórico
async function registrarHistorico(acao, descricao, usuario, checklistId, placa) {
  try {
    await supaFetch('POST', 'historico', {
      id: Date.now(),
      acao,
      descricao,
      usuario: usuario || 'Sistema',
      checklist_id: checklistId || null,
      placa: placa || ''
    });
  } catch(e) {
    console.error('Erro ao registrar histórico:', e.message);
  }
}

async function uploadCloudinary(base64img, publicId) {
  return new Promise((resolve) => {
    try {
      if (!base64img || base64img.length < 100) { resolve(''); return; }
      const timestamp = Math.floor(Date.now() / 1000);
      const sigStr = `public_id=${publicId}&timestamp=${timestamp}${CLOUD_SECRET}`;
      const signature = crypto.createHash('sha256').update(sigStr).digest('hex');
      const imgData = base64img.includes(',') ? base64img.split(',')[1] : base64img;
      const boundary = '----FormBoundary' + Date.now();
      const fields = {
        file: `data:image/jpeg;base64,${imgData}`,
        api_key: CLOUD_KEY,
        timestamp: String(timestamp),
        public_id: publicId,
        signature
      };
      let body = '';
      for (const [k, v] of Object.entries(fields)) {
        body += `--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`;
      }
      body += `--${boundary}--\r\n`;
      const bodyBuf = Buffer.from(body, 'utf8');
      const options = {
        hostname: 'api.cloudinary.com',
        path: `/v1_1/${CLOUD_NAME}/image/upload`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': bodyBuf.length
        }
      };
      const req = https.request(options, res => {
        let raw = '';
        res.on('data', d => raw += d);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            if (parsed.secure_url) { resolve(parsed.secure_url); }
            else { resolve(''); }
          } catch(e) { resolve(''); }
        });
      });
      req.on('error', () => resolve(''));
      req.write(bodyBuf);
      req.end();
    } catch(e) { resolve(''); }
  });
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

const USUARIOS = [
  { id: 1, nome: 'Gerente', login: 'admin', senha: hash('admin123'), role: 'admin' }
];
const EQUIPES = [
  { id: 1, nome: 'Equipe Alfa',    chefe: 'Cerqueira' },
  { id: 2, nome: 'Equipe Bravo',   chefe: 'Savio' },
  { id: 3, nome: 'Equipe Charlie', chefe: 'Cleber' },
  { id: 4, nome: 'Equipe Delta',   chefe: 'Douglas' }
];
const VIATURAS = [
  { id: 1, placa: 'CRS',      modelo: 'IVECO DAILY',      equipe_id: 1 },
  { id: 2, placa: 'DOSA 318', modelo: 'IVECO MAGIRUS X6', cci: '02', equipe_id: 2 },
  { id: 3, placa: 'AP-2',     modelo: 'FÊNIX',            cci: '03', equipe_id: 3 },
  { id: 4, placa: 'DOSA 371', modelo: 'IVECO MAGIRUS X6', cci: '01', equipe_id: 4 }
];

// AUTH
app.post('/api/auth/login', async (req, res) => {
  const { login, senha } = req.body;
  const u = USUARIOS.find(x => x.login === login && x.senha === hash(senha));
  if (!u) {
    await registrarHistorico('LOGIN_FALHOU', `Tentativa de login com usuário: ${login}`, login, null, null);
    return res.status(401).json({ erro: 'Login ou senha incorretos' });
  }
  const token = newSession(u);
  await registrarHistorico('LOGIN', `${u.nome} entrou no sistema`, u.nome, null, null);
  res.json({ token, nome: u.nome, role: u.role });
});

app.post('/api/auth/logout', async (req, res) => {
  const auth = req.headers.authorization || '';
  const s = sessions[auth.replace('Bearer ', '')];
  if (s) await registrarHistorico('LOGOUT', `${s.nome} saiu do sistema`, s.nome, null, null);
  delete sessions[auth.replace('Bearer ', '')];
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth(), (req, res) => {
  res.json({ nome: req.user.nome, role: req.user.role });
});

app.get('/api/equipes',  (req, res) => res.json(EQUIPES));
app.get('/api/viaturas', (req, res) => res.json(VIATURAS));

function fromSupa(c) {
  return {
    id: c.id,
    data: c.data,
    dataFormatada: c.data_formatada,
    mes: c.mes,
    dia: c.dia,
    sci: c.sci,
    cci: c.cci,
    placa: c.placa,
    modelo: c.modelo,
    tipo_viatura: c.tipo_viatura,
    formulario_id: c.formulario_id,
    formulario_titulo: c.formulario_titulo,
    preenchidoPor: c.preenchido_por,
    nome: c.nome,
    equipe: c.equipe,
    nome_chefe: c.nome_chefe,
    obs: c.obs,
    itens: c.itens,
    nc: c.nc,
    status: c.status,
    sigMotorista: c.sig_motorista || '',
    sigChefe: c.sig_chefe || '',
    aprovado_chefe: c.aprovado_chefe,
    chefe: c.chefe,
    equipe_chefe: c.equipe_chefe,
    data_aprovacao: c.data_aprovacao
  };
}

app.get('/api/checklists/publico', async (req, res) => {
  try {
    const data = await supaFetch('GET', 'checklists', null, '?order=id.desc');
    res.json(data.map(fromSupa));
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

app.get('/api/checklists/publico/:id', async (req, res) => {
  try {
    const data = await supaFetch('GET', 'checklists', null, `?id=eq.${req.params.id}`);
    if (!data.length) return res.status(404).json({ erro: 'Não encontrado' });
    res.json(fromSupa(data[0]));
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

app.get('/api/checklists', requireAuth(), async (req, res) => {
  try {
    let query = '?order=id.desc';
    if (req.query.mes) query += `&mes=eq.${req.query.mes}`;
    if (req.query.status) query += `&status=eq.${req.query.status}`;
    const data = await supaFetch('GET', 'checklists', null, query);
    let result = data.map(fromSupa);
    if (req.query.equipe_id) {
      const eq = EQUIPES.find(e => e.id == req.query.equipe_id);
      if (eq) {
        const nomeSimples = eq.nome.replace('Equipe ', '');
        result = result.filter(c =>
          c.equipe === nomeSimples ||
          c.equipe === eq.nome ||
          c.nome_chefe === eq.chefe
        );
      }
    }
    if (req.query.viatura_id) {
      const v = VIATURAS.find(v => v.id == req.query.viatura_id);
      if (v) result = result.filter(c => c.placa === v.placa);
    }
    res.json(result);
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

app.post('/api/checklists', async (req, res) => {
  try {
    const id = Date.now();
    const sigUrl = await uploadCloudinary(req.body.sigMotorista, `sig_mot_${id}`);
    const tipoLabel = req.body.preenchidoPor==='nome_guerra_ba2'?'BA-2':req.body.preenchidoPor==='lider_resgate'?'Líder':'Motorista';
    const record = {
      id,
      data: req.body.data,
      data_formatada: req.body.dataFormatada,
      mes: req.body.mes,
      dia: req.body.dia,
      sci: req.body.sci || 'CUIABÁ',
      cci: req.body.cci || '',
      placa: req.body.placa,
      modelo: req.body.modelo,
      tipo_viatura: req.body.tipo_viatura,
      formulario_id: req.body.formulario_id,
      formulario_titulo: req.body.formulario_titulo,
      preenchido_por: req.body.preenchidoPor,
      nome: req.body.nome,
      equipe: req.body.equipe,
      nome_chefe: req.body.nome_chefe,
      obs: req.body.obs || '',
      itens: req.body.itens || {},
      nc: req.body.nc || 0,
      status: req.body.status || 'ok',
      sig_motorista: sigUrl,
      sig_chefe: '',
      aprovado_chefe: false
    };
    const saved = await supaFetch('POST', 'checklists', record);

    // ✅ Histórico — criação
    await registrarHistorico(
      'CHECKLIST_CRIADO',
      `${tipoLabel} ${req.body.nome} preencheu checklist da viatura ${req.body.placa} — dia ${req.body.dia} — ${req.body.nc||0} NC`,
      req.body.nome,
      id,
      req.body.placa
    );

    if (record.nc > 0) {
      await supaFetch('POST', 'alertas', {
        id: Date.now()+1,
        tipo: 'nok',
        msg: `${record.nc} NC — ${record.placa} — ${record.nome} (${tipoLabel})`,
        checklist_id: id,
        data: record.data,
        lido: false
      });
    }

    res.json(fromSupa(Array.isArray(saved) ? saved[0] : saved));
  } catch(e) {
    console.error('Erro ao salvar:', e.message);
    res.status(500).json({ erro: e.message });
  }
});

app.delete('/api/checklists/:id', requireAuth(['admin']), async (req, res) => {
  try {
    // Busca dados antes de excluir
    const dados = await supaFetch('GET', 'checklists', null, `?id=eq.${req.params.id}`);
    const c = dados[0];
    await supaFetch('DELETE', 'checklists', null, `?id=eq.${req.params.id}`);

    // ✅ Histórico — exclusão
    await registrarHistorico(
      'CHECKLIST_EXCLUIDO',
      `Admin excluiu checklist da viatura ${c?.placa||'?'} — ${c?.nome||'?'} — dia ${c?.dia||'?'}`,
      req.user?.nome || 'Admin',
      Number(req.params.id),
      c?.placa || ''
    );

    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ erro: e.message });
  }
});

app.post('/api/checklists/:id/aprovar', async (req, res) => {
  try {
    const sigChefeUrl = await uploadCloudinary(req.body.sigChefe, `sig_chefe_${req.params.id}`);
    const updated = await supaFetch('PATCH', 'checklists', {
      sig_chefe: sigChefeUrl,
      aprovado_chefe: true,
      chefe: req.body.chefe,
      equipe_chefe: req.body.equipe_chefe,
      data_aprovacao: req.body.data_aprovacao
    }, `?id=eq.${req.params.id}`);

    // ✅ Histórico — aprovação
    const dados = await supaFetch('GET', 'checklists', null, `?id=eq.${req.params.id}`);
    const c = dados[0];
    await registrarHistorico(
      'CHECKLIST_APROVADO',
      `Chefe ${req.body.chefe} (Equipe ${req.body.equipe_chefe}) aprovou checklist da viatura ${c?.placa||'?'} — ${c?.nome||'?'} — dia ${c?.dia||'?'}`,
      req.body.chefe,
      Number(req.params.id),
      c?.placa || ''
    );

    res.json(fromSupa(Array.isArray(updated) ? updated[0] : updated));
  } catch(e) {
    console.error('Erro ao aprovar:', e.message);
    res.status(500).json({ erro: e.message });
  }
});

// ALERTAS
app.get('/api/alertas', requireAuth(['admin']), async (req, res) => {
  try {
    const data = await supaFetch('GET', 'alertas', null, '?lido=eq.false&order=id.desc&limit=50');
    res.json(data);
  } catch(e) { res.status(500).json({ erro: e.message }); }
});
app.put('/api/alertas/:id/lido', requireAuth(['admin']), async (req, res) => {
  try {
    await supaFetch('PATCH', 'alertas', { lido: true }, `?id=eq.${req.params.id}`);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ erro: e.message }); }
});
app.put('/api/alertas/lidos/todos', requireAuth(['admin']), async (req, res) => {
  try {
    await supaFetch('PATCH', 'alertas', { lido: true }, '?lido=eq.false');
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ erro: e.message }); }
});

// ✅ HISTÓRICO
app.get('/api/historico', requireAuth(['admin']), async (req, res) => {
  try {
    let query = '?order=data_acao.desc&limit=100';
    if (req.query.placa) query += `&placa=eq.${req.query.placa}`;
    const data = await supaFetch('GET', 'historico', null, query);
    res.json(data);
  } catch(e) { res.status(500).json({ erro: e.message }); }
});

// DASHBOARD
app.get('/api/dashboard', requireAuth(['admin']), async (req, res) => {
  try {
    const mes = req.query.mes || new Date().toISOString().slice(0,7);
    const data = await supaFetch('GET', 'checklists', null, `?mes=eq.${mes}&order=id.desc`);
    const cls = data.map(fromSupa);
    const alertas = await supaFetch('GET', 'alertas', null, '?lido=eq.false');
    const porViatura = VIATURAS.map(v => {
      const myCls = cls.filter(c => c.placa === v.placa);
      const nok = myCls.filter(c=>c.status==='nok').length;
      return { ...v, total: myCls.length, ok: myCls.length-nok, nok };
    });
    const porEquipe = EQUIPES.map(e => {
      const nomeSimples = e.nome.replace('Equipe ','');
      const myCls = cls.filter(c =>
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
      const n=c.nome||'—';
      if(!motMap[n]) motMap[n]={nome:n,total:0,nok:0};
      motMap[n].total++;
      if(c.status==='nok') motMap[n].nok++;
    });
    res.json({
      mes, total:cls.length,
      ok:cls.filter(c=>c.status==='ok').length,
      nok:cls.filter(c=>c.status==='nok').length,
      alertas: alertas.length,
      porViatura, porEquipe, porDia,
      motoristas:Object.values(motMap).sort((a,b)=>b.total-a.total)
    });
  } catch(e) { res.status(500).json({ erro: e.message }); }
});

// EXPORT CSV
app.get('/api/export/csv', requireAuth(), async (req, res) => {
  try {
    let query = '?order=data.asc';
    if (req.query.mes) query += `&mes=eq.${req.query.mes}`;
    const data = await supaFetch('GET', 'checklists', null, query);
    const cls = data.map(fromSupa);
    const header=['ID','Data','Placa','Modelo','Tipo','Equipe','Nome','Status','NC','Observacao'];
    const rows=cls.map(c=>[
      c.id, c.data, c.placa, c.modelo||'',
      c.preenchidoPor==='nome_guerra_ba2'?'BA-2':c.preenchidoPor==='lider_resgate'?'Líder':'Motorista',
      c.equipe, c.nome||'',
      c.status, c.nc||0, (c.obs||'').replace(/,/g,';')
    ]);
    const csv='\uFEFF'+[header,...rows].map(r=>r.join(',')).join('\n');
    res.setHeader('Content-Type','text/csv; charset=utf-8');
    res.setHeader('Content-Disposition','attachment; filename="checklists.csv"');
    res.send(csv);
  } catch(e) { res.status(500).json({ erro: e.message }); }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ CheckViatura Supabase em http://localhost:${PORT}`));
