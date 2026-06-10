
// ═══════════════════════════════════════════════════════
// ESTADO GLOBAL
// ═══════════════════════════════════════════════════════
let state = {
  viaturaKey: null,
  formularioId: null,
  formulario: null,
  viatura: null,
  itens: {},  // { itemKey: 'C' | 'NC' | 'NA' }
  mes: '',
  dia: '',
  nome: '',
  cpf: '',
  obs: ''
};

// DATA
const now = new Date();
document.getElementById('hdr-date').textContent = now.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'});
document.getElementById('mes-ano-label').textContent = now.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});

// ═══════════════════════════════════════════════════════
// INIT VIATURA GRID
// ═══════════════════════════════════════════════════════
function selecionaEquipe(equipe,chefe,el){document.querySelectorAll(".equipe-card").forEach(c=>c.classList.remove("selected"));el.classList.add("selected");document.getElementById("id-equipe").value=equipe;state.equipe=equipe;state.chefe=chefe;let nc=document.getElementById("nome-chefe");if(nc)nc.value=chefe;let sc=document.getElementById("sig-chefe-nome");if(sc)sc.textContent=chefe;}function initGrid() {
  const icons = { ambulancia_resgate:'🚑', autobomba:'🚒' };
  const grid = document.getElementById('viaturas-grid');
  grid.innerHTML = Object.entries(FORMULARIOS).map(([key, v]) => {
    const icon = icons[v.tipo] || '🚗';
    const badges = v.formularios.map(f => `<span class="form-badge">${f.titulo.split('—')[0].trim()}</span>`).join('');
    return `<div class="viatura-card" onclick="selectViatura('${key}')">
      ${v.cci ? `<div class="vc-cci">CCI: ${v.cci}</div>` : ''}
      <div class="vc-top">
        <div class="vc-icon">${icon}</div>
        <div><div class="vc-placa">${v.placa}</div><div class="vc-modelo">${v.modelo}</div></div>
      </div>
      <div class="vc-form-badges">${badges}</div>
    </div>`;
  }).join('');
}
initGrid();

// ═══════════════════════════════════════════════════════
// NAV STEPS
// ═══════════════════════════════════════════════════════
let currentPage = 1;
function goPage(n) {
  if (n === 4 && !validatePage3()) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + n).classList.add('active');
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active','done');
    if (i+1 < n) s.classList.add('done');
    if (i+1 === n) s.classList.add('active');
  });
  currentPage = n;
  if (n === 4) buildTable();
  if (n === 5) buildSigPage();
  window.scrollTo(0,0);
}

// ═══════════════════════════════════════════════════════
// PAGE 1 → 2: SELECIONAR VIATURA
// ═══════════════════════════════════════════════════════
function selectViatura(key) {
  state.viaturaKey = key;
  state.viatura = FORMULARIOS[key];
  document.getElementById('p2-title').textContent = `Formulários — ${state.viatura.placa}`;
  document.getElementById('p2-sub').textContent = `${state.viatura.modelo}${state.viatura.cci ? ' | CCI: ' + state.viatura.cci : ''}`;

  const sel = document.getElementById('form-selector');
  sel.innerHTML = state.viatura.formularios.map(f => {
    const totalItens = f.secoes.reduce((a,s) => a + s.itens.length, 0);
    const quem = { motorista:'Motorista', lider_resgate:'Líder de Resgate', nome_guerra_ba2:'Nome de Guerra BA-2' };
    return `<div class="form-option" onclick="selectFormulario('${f.id}')">
      <div class="fo-title">${f.titulo}</div>
      <div class="fo-sub">Preenchido por: <strong>${quem[f.preenchidoPor]||f.preenchidoPor}</strong></div>
      <div class="fo-itens">${totalItens} itens para inspecionar</div>
    </div>`;
  }).join('');
  goPage(2);
}

// ═══════════════════════════════════════════════════════
// PAGE 2 → 3: SELECIONAR FORMULÁRIO
// ═══════════════════════════════════════════════════════
function selectFormulario(id) {
  state.formularioId = id;
  state.formulario = state.viatura.formularios.find(f => f.id === id);
  state.itens = {};

  // pré-preencher identificação
  document.getElementById('id-viatura').value = state.viatura.placa;
  document.getElementById('id-modelo').value = state.viatura.modelo;
  document.getElementById('id-mes').value = now.toISOString().slice(0,7);
  document.getElementById('id-dia').value = now.getDate();
  document.getElementById('row-nome-guerra-ba').style.display =
    state.formulario.preenchidoPor === 'nome_guerra_ba2' ? 'block' : 'none';

  // label assinatura
  const sig1Labels = { motorista:'ASSINATURA DO MOTORISTA', lider_resgate:'ASSINATURA DO LÍDER DE RESGATE', nome_guerra_ba2:'NOME DE GUERRA "BA-2"' };
  document.getElementById('sig1-label-top').textContent = sig1Labels[state.formulario.preenchidoPor] || 'ASSINATURA';

  goPage(3);
}

// ═══════════════════════════════════════════════════════
// PAGE 3: VALIDAR IDENTIFICAÇÃO
// ═══════════════════════════════════════════════════════
function validatePage3() {
  const nome = document.getElementById('id-nome').value.trim();
  const mes  = document.getElementById('id-mes').value;
  const dia  = document.getElementById('id-dia').value;
  if (!nome) nome="sem nome"; if (false) { alert('Informe o nome/nome de guerra.'); return false; }
  if (!mes)  { alert('Selecione o mês.'); return false; }
  if (!dia)  { alert('Informe o dia da inspeção.'); return false; }

  state.nome = nome;
  state.cpf="";
  state.mes  = mes;
  state.dia  = dia;

  // atualizar cabeçalho
  const mesStr = new Date(mes+'-01').toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).toUpperCase();
  document.getElementById('fi-cci').textContent = state.viatura.cci || 'N/A';
  document.getElementById('fi-viatura').textContent = state.viatura.placa;
  document.getElementById('fi-modelo').textContent = state.viatura.modelo;
  document.getElementById('fi-mes').textContent = mesStr;
  document.getElementById('fi-nome').textContent = state.nome;
  document.getElementById('form-titulo').textContent = state.formulario.titulo;
  document.getElementById('sig-cpf-label').textContent = 'CPF/Login: ' + (state.cpf || '—');
  document.getElementById('sig-motorista-nome').textContent = state.nome;

  return true;
}

// ═══════════════════════════════════════════════════════
// PAGE 4: TABELA DE INSPEÇÃO
// ═══════════════════════════════════════════════════════
function buildTable() {
  const tbody = document.getElementById('cl-tbody');
  tbody.innerHTML = '';
  let globalIdx = 0;

  state.formulario.secoes.forEach(sec => {
    // linha de seção
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" style="background:#E8ECF4;font-size:11px;font-weight:700;color:var(--azul2);padding:6px 10px;text-transform:uppercase;letter-spacing:.4px;">${sec.nome}</td>`;
    tbody.appendChild(tr);

    sec.itens.forEach(it => {
      const key = `item-${globalIdx}`;
      globalIdx++;
      const tr2 = document.createElement('tr');
      const qntCell = it.qnt ? `<td class="td-qnt">${it.qnt}</td>` : `<td class="td-qnt">—</td>`;
      tr2.innerHTML = `
        <td class="td-num">${it.num}</td>
        ${qntCell}
        <td class="td-item">${it.item}</td>
        <td class="td-status">
          <div class="status-btn-group">
            <button class="sbtn sbtn-c" id="btn-c-${key}" onclick="setStatus('${key}','C')">C</button>
            <button class="sbtn sbtn-nc" id="btn-nc-${key}" onclick="setStatus('${key}','NC')">NC</button>
            <button class="sbtn sbtn-na" id="btn-na-${key}" onclick="setStatus('${key}','NA')">NA</button>
          </div>
        </td>`;
      tbody.appendChild(tr2);
      tr2.dataset.itemKey = key;
      tr2.dataset.itemName = it.item;
      tr2.dataset.itemNum = it.num;
      if (state.itens[key]) {
        setStatus(key, state.itens[key], true);
      }
    });
  });
  updateProgress();
}

function setStatus(key, val, silent=false) {
  state.itens[key] = val;
  ['C','NC','NA'].forEach(v => {
    const btn = document.getElementById(`btn-${v.toLowerCase()}-${key}`);
    if (btn) btn.classList.toggle('active', v === val);
  });
  // cor da linha
  const tr = document.querySelector(`tr[data-item-key="${key}"]`);
  if (tr) {
    tr.style.background = val === 'NC' ? '#FFF5F5' : val === 'NA' ? '#FAFAFA' : '';
  }
  if (!silent) updateProgress();
}

function updateProgress() {
  const keys = Object.keys(state.itens);
  // contar total de itens da tabela
  let total = 0;
  state.formulario.secoes.forEach(s => total += s.itens.length);
  const done = keys.length;
  const nc = Object.values(state.itens).filter(v => v === 'NC').length;
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-bar').style.background = nc > 0 ? '#C53030' : '#E8520A';
  document.getElementById('progress-left').textContent = `${done} de ${total} itens avaliados`;
  document.getElementById('progress-right').textContent = nc > 0 ? `⚠ ${nc} NC` : (total-done > 0 ? `${total-done} restantes` : '✓ Completo');
  const badge = document.getElementById('progress-info-text');
  badge.textContent = `${done} / ${total}`;
  badge.className = 'badge ' + (done === total ? (nc > 0 ? 'badge-nc' : 'badge-ok') : 'badge-pendente');
}

// ═══════════════════════════════════════════════════════
// PAGE 5: ASSINATURAS
// ═══════════════════════════════════════════════════════
function buildSigPage() {
  state.obs = document.getElementById('cl-obs').value;
  // listar NCs
  const ncs = [];
  document.querySelectorAll('#cl-tbody tr[data-item-key]').forEach(tr => {
    const key = tr.dataset.itemKey;
    if (state.itens[key] === 'NC') {
      ncs.push({ num: tr.dataset.itemNum, nome: tr.dataset.itemName });
    }
  });
  const box = document.getElementById('resumo-nc');
  if (ncs.length > 0) {
    box.style.display = 'block';
    document.getElementById('nc-list').innerHTML = ncs.map(n =>
      `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:.5px solid #FEE2E2;font-size:13px;color:var(--vermelho);">
        <span style="font-weight:700;min-width:20px;">${n.num}</span> ${n.nome}
      </div>`
    ).join('');
  } else {
    box.style.display = 'none';
  }
  initCanvas('canvas-motorista');
  initCanvas('canvas-chefe');
}

// ═══════════════════════════════════════════════════════
// CANVAS
// ═══════════════════════════════════════════════════════
function initCanvas(id) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  c.width = c.offsetWidth * dpr; c.height = 90 * dpr;
  ctx.scale(dpr, dpr);
  ctx.strokeStyle = '#E8520A'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  let drawing = false, lx, ly;
  function pos(e){ const r=c.getBoundingClientRect(),s=e.touches?e.touches[0]:e; return [s.clientX-r.left, s.clientY-r.top]; }
  c.onmousedown = e => { drawing=true; [lx,ly]=pos(e); };
  c.ontouchstart = e => { e.preventDefault(); drawing=true; [lx,ly]=pos(e); };
  c.onmousemove = e => { if(!drawing)return; const[x,y]=pos(e); ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(x,y); ctx.stroke(); [lx,ly]=[x,y]; };
  c.ontouchmove = e => { e.preventDefault(); if(!drawing)return; const[x,y]=pos(e); ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(x,y); ctx.stroke(); [lx,ly]=[x,y]; };
  ['mouseup','mouseleave','touchend'].forEach(ev => c.addEventListener(ev, ()=>drawing=false));
}
function clearCanvas(id) { const c=document.getElementById(id); c.getContext('2d').clearRect(0,0,c.width,c.height); }

// ═══════════════════════════════════════════════════════
// SALVAR
// ═══════════════════════════════════════════════════════
async function salvarChecklist() {
  let total = 0;
  state.formulario.secoes.forEach(s => total += s.itens.length);
  const done = Object.keys(state.itens).length;
  if (done < total) {
    if (!confirm(`${total - done} item(ns) ainda sem avaliação (C/NC/NA). Salvar mesmo assim?`)) return;
  }

  const btn = document.getElementById('btn-salvar');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Salvando…';

  const nc = Object.values(state.itens).filter(v => v === 'NC').length;
  const mesStr = new Date(state.mes+'-01').toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).toUpperCase();

  // montar itens detalhados
  const itensDetalhados = {};
  let gi = 0;
  state.formulario.secoes.forEach(sec => {
    sec.itens.forEach(it => {
      const key = `item-${gi}`;
      itensDetalhados[key] = { num: it.num, item: it.item, status: state.itens[key] || null };
      gi++;
    });
  });

  const registro = {
    data: `${state.mes}-${String(state.dia).padStart(2,'0')}`,
    mes: state.mes,
    dia: state.dia,
    mesAno: mesStr,
    sci: 'CUIABÁ',
    cci: state.viatura.cci || '',
    placa: state.viatura.placa,
    modelo: state.viatura.modelo,
    tipo_viatura: state.viatura.tipo,
    formulario_id: state.formularioId,
    formulario_titulo: state.formulario.titulo,
    preenchidoPor: state.formulario.preenchidoPor,
    nome: state.nome,
    cpf: state.cpf,
    nome_chefe: document.getElementById('nome-chefe').value,
    obs: document.getElementById('cl-obs').value,
    itens: itensDetalhados,
    nc, status: nc > 0 ? 'nok' : 'ok',
    sigMotorista: document.getElementById('canvas-motorista').toDataURL(),
    sigChefe:     document.getElementById('canvas-chefe').toDataURL()
  };

  try {
    const r = await fetch('/api/checklists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registro)
    });
    if (!r.ok) throw new Error(await r.text());

    const aviso = document.getElementById('modal-nc-aviso');
    aviso.innerHTML = nc > 0
      ? `<div class="alert alert-warn" style="margin-bottom:12px;">⚠️ ${nc} item(ns) NC registrado(s). O chefe de equipe foi notificado.</div>`
      : `<div class="alert alert-success" style="margin-bottom:12px;">Todos os itens em conformidade.</div>`;
    document.getElementById('modal-ok').classList.add('open');
  } catch(e) {
    alert('Erro ao salvar: ' + e.message);
  } finally {
    btn.disabled = false; btn.innerHTML = '✅ Salvar e Encaminhar ao Chefe';
  }
}

function novoChecklist() {
  document.getElementById('modal-ok').classList.remove('open');
  state = { viaturaKey:null, formularioId:null, formulario:null, viatura:null, itens:{}, mes:'', dia:'', nome:'', cpf:'', obs:'' };
  ['id-nome','id-cpf','id-dia','cl-obs','nome-chefe','gov-pin'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  goPage(1);
}

// modal overlay click
document.getElementById('modal-ok').addEventListener('click', e => { if(e.target===e.currentTarget) novoChecklist(); });
