<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Relatório Mensal — CheckViatura</title>
<style>
:root{
  --azul:#E8520A;--azul2:#C43D00;--azul-claro:#FFF0E8;--azul-borda:#F47B3A;
  --cinza:#6B7280;--cinza-claro:#F9F5F2;--cinza-borda:#E2D5CC;
  --texto:#1A0A00;--texto-sec:#6B5A52;--branco:#fff;--bg:#FBF5F0;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;background:var(--bg);color:var(--texto);}
header{background:linear-gradient(135deg,#C43D00,#E8520A);color:#fff;padding:12px 20px;display:flex;align-items:center;gap:12px;}
.container{max-width:1200px;margin:0 auto;padding:20px;}
.filtros{background:#fff;border:1px solid var(--cinza-borda);border-radius:12px;padding:20px;margin-bottom:20px;display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;}
.form-group{display:flex;flex-direction:column;gap:4px;}
.form-group label{font-size:11px;font-weight:700;color:var(--texto-sec);text-transform:uppercase;letter-spacing:.4px;}
.form-group select,.form-group input{padding:9px 12px;border:1px solid var(--cinza-borda);border-radius:8px;font-size:14px;font-family:inherit;}
.btn{padding:10px 22px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;}
.btn-primary{background:var(--azul);color:#fff;}
.btn-pdf{background:#1a1a1a;color:#fff;}
.relatorio-wrap{background:#fff;border-radius:12px;overflow:auto;border:1px solid var(--cinza-borda);}
.rel-header{background:var(--azul2);color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;}
.rel-header-title{font-size:15px;font-weight:700;}
.rel-info{background:var(--azul-claro);border-bottom:1px solid var(--azul-borda);padding:8px 16px;display:flex;gap:24px;font-size:12px;}
.rel-info span{color:var(--texto-sec);}
.rel-info strong{color:var(--azul2);}
.legenda{display:flex;gap:16px;padding:8px 16px;background:#f5f5f5;border-bottom:1px solid var(--cinza-borda);font-size:11px;align-items:center;}
.leg{display:inline-flex;align-items:center;gap:4px;}
.leg-c{color:#2D7D32;font-weight:700;}
.leg-nc{color:#9B1C1C;font-weight:700;}
.leg-na{color:#6B7280;font-weight:700;}
table.rel-table{width:100%;border-collapse:collapse;font-size:11px;min-width:900px;}
.rel-table th{background:#E8ECF4;padding:5px 4px;text-align:center;font-size:10px;font-weight:700;color:#374151;border:1px solid #ddd;white-space:nowrap;}
.rel-table th.th-item{text-align:left;min-width:180px;padding:5px 8px;}
.rel-table td{padding:4px 3px;border:1px solid #eee;text-align:center;vertical-align:middle;}
.rel-table td.td-item{text-align:left;font-size:10px;padding:4px 8px;font-weight:500;}
.rel-table td.td-num{background:#fafafa;color:#888;font-weight:600;width:28px;}
.rel-table tr:nth-child(even) td{background:#fafafa;}
.rel-table tr:nth-child(even) td.td-num{background:#f0f0f0;}
.cel-c{color:#2D7D32;font-weight:700;font-size:10px;}
.cel-nc{color:#9B1C1C;font-weight:700;font-size:10px;background:#FEE2E2 !important;}
.cel-na{color:#6B7280;font-size:10px;}
.cel-vazio{color:#ccc;font-size:10px;}
.sig-footer{display:flex;gap:20px;padding:16px;border-top:2px solid var(--azul-borda);background:#FFF8F5;}
.sig-box{flex:1;border:1px dashed var(--cinza-borda);border-radius:8px;padding:10px;min-height:80px;display:flex;flex-direction:column;justify-content:space-between;}
.sig-label{font-size:10px;font-weight:700;text-transform:uppercase;color:var(--texto-sec);margin-bottom:6px;}
.sig-img{max-height:60px;max-width:100%;object-fit:contain;}
.sig-nome{font-size:10px;text-align:center;color:var(--azul2);border-top:1px solid var(--cinza-borda);padding-top:4px;margin-top:4px;}
@media print {
  body{background:#fff;}
  header,.filtros,.btn-pdf,.no-print{display:none!important;}
  .relatorio-wrap{border:none;border-radius:0;}
  .container{padding:0;max-width:100%;}
  table.rel-table{font-size:9px;}
  .rel-table th{font-size:8px;padding:3px 2px;}
  .rel-table td{padding:2px;}
  .rel-table td.td-item{font-size:8px;}
  .sig-footer{break-inside:avoid;}
}
</style>
</head>
<body>

<header>
  <div style="display:flex;align-items:center;gap:14px;">
    <div style="font-size:22px;font-weight:900;color:#fff;">med+</div>
    <div>
      <div style="font-size:10px;color:rgba(255,255,255,.75);">med+ Group</div>
      <div style="font-size:16px;font-weight:800;">Relatório Mensal — CheckViatura</div>
    </div>
  </div>
  <div style="margin-left:auto;">
    <a href="/admin.html" style="color:rgba(255,255,255,.8);font-size:12px;text-decoration:none;">← Voltar ao Admin</a>
  </div>
</header>

<div class="container">
  <div class="filtros no-print">
    <div class="form-group">
      <label>Viatura</label>
      <select id="sel-viatura">
        <option value="">Selecione...</option>
        <option value="CRS">CRS — IVECO DAILY</option>
        <option value="DOSA 318">DOSA 318 — IVECO MAGIRUS X6</option>
        <option value="AP-2">AP-2 — FÊNIX</option>
        <option value="DOSA 371">DOSA 371 — IVECO MAGIRUS X6</option>
      </select>
    </div>
    <div class="form-group">
      <label>Tipo de Formulário</label>
      <select id="sel-tipo">
        <option value="motorista">Motorista</option>
        <option value="lider_resgate">Líder de Resgate</option>
        <option value="nome_guerra_ba2">BA-2</option>
      </select>
    </div>
    <div class="form-group">
      <label>Mês/Ano</label>
      <input type="month" id="sel-mes">
    </div>
    <button class="btn btn-primary" onclick="gerarRelatorio()">🔍 Gerar Relatório</button>
    <button class="btn btn-pdf" onclick="window.print()">🖨️ Imprimir / PDF</button>
  </div>

  <div id="relatorio-container"></div>
</div>

<script>
document.getElementById('sel-mes').value = new Date().toISOString().slice(0,7);

const ITENS = {
  'CRS': {
    motorista: [
      'LATARIA, PINTURA','LIMPEZA GERAL DO CARRO','NÍVEL DO ÓLEO DO MOTOR',
      'NÍVEL DO FLUÍDO DE ARREFECIMENTO','NÍVEL DO FLUÍDO DA DIREÇÃO','IGNIÇÃO',
      'PARTIDA DO MOTOR','PAINEL DE INSTRUMENTOS E ADVERTÊNCIA','NÍVEL DE COMBUSTÍVEL',
      'NÍVEL DO FLUÍDO DE FREIO','LIMPADOR DE PÁRA-BRISAS','FARÓIS',
      'SETAS DIRECIONAIS','LUZ DE RÉ','LUZ CIDADE','LUZ DE FREIO','PISCA ALERTA',
      'ILUMINAÇÃO GERAL DA CABINE','RÁDIO TRANSCEPTOR','ILUMINAÇÃO EXTERNA',
      'ILUMINAÇÃO INTERNA DO BAÚ','GIROFLEX','MEGAFONE','SIRENE','MAPA DE GRADE',
      'BUZINA','CALIBRAGEM DOS PNEUS','DIREÇÃO','FREIOS','SUSPENSÃO',
      'ENCAIXE CAIXA DE MARCHAS','TEMPERATURA DO MOTOR','CHAVE DE RODA',
      'TRIÂNGULO DE SINALIZAÇÃO','MACACO','GUINCHO COMPLETO COM CONTROLE',
      'TACÓGRAFO','TOMADA EXTERNA'
    ],
    lider_resgate: [
      'DESENCARCERADOR HIDRÁULICO','SERRA CIRCULAR PARA CORTE PESADO DE METAL',
      'SERRA SABRE','MACHADO DE RESGATE SEM CUNHA','PÉ-DE-CABRA - 95 CM',
      'PÉ-DE-CABRA - 165 CM','ESCADA EXTENSORA','GANCHO OU GARRA DE SALVAMENTO',
      'FERRAMENTA DE CORTE DE CINTOS DE SEGURANÇA','MANTA RESISTENTE AO FOGO',
      'TORRE DE ILUMINAÇÃO','LANTERNAS PORTÁTEIS','MACA RÍGIDA',
      'COLAR CERVICAL RETRÁTIL','COLETE DE MOBILIZAÇÃO DORSO-LOMBAR MD KED',
      'KIT MÉDICO PRIMEIROS SOCORROS','INALADOR DE OXIGÊNIO COM CILINDRO',
      'CONJUNTO DE TALAS PARA IMOBILIZAÇÃO DE MEMBROS'
    ]
  },
  'DOSA 318': {
    motorista: [
      'LATARIA, PINTURA','LIMPEZA GERAL DO CARRO','NÍVEL DO ÓLEO DO MOTOR',
      'NÍVEL DO FLUÍDO DE ARREFECIMENTO','NÍVEL DO ARLA 32 (ADBLUE)','REGULAGEM BANCO DO OPERADOR',
      'TACÓGRAFO','IGNIÇÃO','PARTIDA DO MOTOR','PAINEL DE INSTRUMENTOS E ADVERTÊNCIAS',
      'NÍVEL DE COMBUSTÍVEL','BUZINA','LIMPADOR DE PÁRA-BRISAS','PÁRA-BRISAS E RETROVISORES',
      'FARÓIS','SETAS DIRECIONAIS E PISCA ALERTA','LUZ DE RÉ, CIDADE E FREIO',
      'ILUMINAÇÃO GERAL DA CABINE','RÁDIO TRANSCEPTOR E MEGAFONE','GIROFLEX E SIRENE',
      'MAPA DE GRADE','ILUMINAÇÃO INTERNA COMPARTIMENTOS','ILUMINAÇÃO EXTERNA / LUZES DE TRABALHO',
      'CALIBRAGEM DE PNEUS (VISUAL)','DIREÇÃO E SUSPENSÃO',
      'FREIOS, FREIO ESTACION. E FREIO MOTOR','ENCAIXE CAIXA DE MARCHAS',
      'TEMPERATURA DO MOTOR E PRESSÃO DO ÓLEO','PAINÉIS DE OPERAÇÃO / TFT',
      'NÍVEL DO TANQUE DE ÁGUA','PARTIDA DO MOTOR ESTACIONÁRIO','BOMBA DE INCÊNDIO',
      'CANHÃO MONITOR DE TETO','CANHÃO MONITOR DE PÁRA-CHOQUE',
      'COMANDOS JOYSTICK OPERADOR E SALVAMENTO','SISTEMA DE ESCORVA',
      'PRESSÃO DO CILINDRO DE NITROGÊNIO','NÍVEL DO TANQUE DE LGE',
      'TRIÂNGULO DE SINALIZAÇÃO','EXTINTOR ABC 2KG','EXTINTOR ABC 2KG',
      'ALAVANCA DE ELEVAÇÃO DA CABINE'
    ],
    nome_guerra_ba2: [
      '01 MANGUEIRA 1½" (30M) COMP. "R1"','01 MANGUEIRA 2½" (30M) COMP. "R1"',
      '01 CHAVE STORZ 1½" COMP. "R1"','01 REDUÇÃO 2½" PARA 1½" COMP. "R1"',
      '01 ESGUICHO "VR" COMP. "R1"','01 MANIVELA CARRETEL PQ COMP. "R2"',
      '01 MANGOTE PQ 1" (30M) COMP. "R2"','01 "PISTOLA" DE PQ COMP. "R2"',
      '01 MANGUEIRA 1½" (30M) COMP. "R2"','01 CHAVE STORZ 1½" COMP. "R2"',
      '02 CALÇOS COMP. "R2"','TAMPA CILINDRO "N2" COMP. "R2"',
      '01 CHAVE STORZ 1½" COMP. "L3"','01 MANIVELA CARRETEL PQ COMP. "L3"',
      '01 MANGOTE PQ 1" (30M) COMP. "L3"','01 "PISTOLA" DE PQ COMP. "L3"',
      '01 STECKLEITER COMP. "L3"','01 MANGUEIRA 1½" (30M) COMP. "L2"',
      '01 MANGUEIRA 2½" (30M) COMP. "L2"','02 CHAVE STORZ 1½" COMP. "L2"',
      '01 REDUÇÃO 2½" PARA 1½" COMP. "L2"','01 ESGUICHO "VR" COMP. "L2"',
      '02 CHAVES MANGOTE SUCÇÃO COMP. "L1"','02 CHAVES VÁLVULAS CORPO BOMBA COMP. "L1"',
      '01 CHAVE ANGULAR VÁLVULAS COMP. SUPERIOR','01 ESCADA EXTENSORA (4 PARTES) COMP. SUPERIOR',
      '02 MANGOTES 4" (SUCÇÃO) COMP. SUPERIOR','01 CHAVE CANHÃO TETO COMP. SUPERIOR',
      '01 RALO DE SUCÇÃO COMP. SUPERIOR','01 DERIVANTE 2½" PARA 2x1½" CABINE',
      'PRESILHA TAMPA TANQUE "LGE" COMP. SUPERIOR','PRESILHA TAMPA TANQUE ÁGUA COMP. SUPERIOR',
      '01 TELA TANQUE "LGE" COMP. SUPERIOR','01 TELA TANQUE ÁGUA COMP. SUPERIOR'
    ]
  },
  'AP-2': {
    motorista: [
      'LATARIA, PINTURA','LIMPEZA GERAL DO CARRO','NÍVEL DO ÓLEO DO MOTOR',
      'NÍVEL DO FLUÍDO DE ARREFECIMENTO','NÍVEL DO ARLA 32 (ADBLUE)','REGULAGEM BANCO DO OPERADOR',
      'TACÓGRAFO','IGNIÇÃO','PARTIDA DO MOTOR','PAINEL DE INSTRUMENTOS E ADVERTÊNCIAS',
      'NÍVEL DE COMBUSTÍVEL','BUZINA','LIMPADOR DE PÁRA-BRISAS','PÁRA-BRISAS E RETROVISORES',
      'FARÓIS','SETAS DIRECIONAIS E PISCA','LUZ DE RÉ, CIDADE E FREIO',
      'ILUMINAÇÃO GERAL DA CABINE','RÁDIO TRANSCEPTOR E MEGAFONE','MEGAFONE',
      'GIROFLEX E SIRENE','MAPA DE GRADE','ILUMINAÇÃO EXTERNA / LUZES DE TRABALHO',
      'CALIBRAGEM DE PNEUS (VISUAL)','DIREÇÃO E SUSPENSÃO',
      'FREIOS, FREIO ESTACION. E FREIO MOTOR','ENCAIXE CAIXA DE MARCHAS',
      'TEMPERATURA DO MOTOR E PRESSÃO DO ÓLEO','NÍVEL DO TANQUE DE ÁGUA',
      'BOMBA DE INCÊNDIO','CANHÃO MONITOR DE TETO','CANHÃO MONITOR DE PÁRA-CHOQUE',
      'COMANDOS JOYSTICK','SISTEMA DE ESCORVA','PRESSÃO DO CILINDRO DE NITROGÊNIO',
      'NÍVEL DO TANQUE DE LGE','TRIÂNGULO DE SINALIZAÇÃO','EXTINTOR ABC 2KG',
      'ALAVANCA DE ELEVAÇÃO DA CABINE'
    ],
    nome_guerra_ba2: [
      '01 MANGUEIRA 1½" (30M) COMP. "R1"','01 ESGUICHO "VR" COMP. "R1"',
      '02 CHAVES STORZ COMP. "R1"','01 MANGUEIRA 1½" (30M) COMP. "R2"',
      '01 MANIVELA CARRETEL PQ COMP. "R2"','01 MANGOTE PQ 1" (30M) COMP. "R2"',
      '01 "PISTOLA" DE PQ COMP. "R2"','01 CHAVE CANHÃO SUPERIOR COMP. TRASEIRO',
      '01 MANGUEIRA 1½" (30M) COMP. "L1"','01 ESGUICHO "VR" COMP. "L1"',
      '02 CHAVES STORZ COMP. "L1"','01 ESCADA EXTENSORA COMP. SUPERIOR',
      '02 MANGOTES 4" (SUCÇÃO) COMP. SUPERIOR','01 RALO DE SUCÇÃO COMP. SUPERIOR',
      'PRESILHA TAMPA TANQUE "LGE" COMP. SUPERIOR','01 TELA TANQUE ÁGUA COMP. SUPERIOR',
      '01 TELA TANQUE "LGE" COMP. SUPERIOR','01 TELA TANQUE ÁGUA COMP. SUPERIOR'
    ]
  },
  'DOSA 371': {
    motorista: [
      'LATARIA, PINTURA','LIMPEZA GERAL DO CARRO','NÍVEL DO ÓLEO DO MOTOR',
      'NÍVEL DO FLUÍDO DE ARREFECIMENTO','NÍVEL DO ARLA 32 (ADBLUE)','REGULAGEM BANCO DO OPERADOR',
      'TACÓGRAFO','IGNIÇÃO','PARTIDA DO MOTOR','PAINEL DE INSTRUMENTOS E ADVERTÊNCIAS',
      'NÍVEL DE COMBUSTÍVEL','BUZINA','LIMPADOR DE PÁRA-BRISAS','PÁRA-BRISAS E RETROVISORES',
      'FARÓIS','SETAS DIRECIONAIS E PISCA ALERTA','LUZ DE RÉ, CIDADE E FREIO',
      'ILUMINAÇÃO GERAL DA CABINE','RÁDIO TRANSCEPTOR E MEGAFONE','GIROFLEX E SIRENE',
      'MAPA DE GRADE','ILUMINAÇÃO INTERNA COMPARTIMENTOS','ILUMINAÇÃO EXTERNA / LUZES DE TRABALHO',
      'CALIBRAGEM DE PNEUS (VISUAL)','DIREÇÃO E SUSPENSÃO',
      'FREIOS, FREIO ESTACION. E FREIO MOTOR','ENCAIXE CAIXA DE MARCHAS',
      'TEMPERATURA DO MOTOR E PRESSÃO DO ÓLEO','PAINÉIS DE OPERAÇÃO / TFT',
      'NÍVEL DO TANQUE DE ÁGUA','PARTIDA DO MOTOR ESTACIONÁRIO','BOMBA DE INCÊNDIO',
      'CANHÃO MONITOR DE TETO','CANHÃO MONITOR DE PÁRA-CHOQUE',
      'COMANDOS JOYSTICK OPERADOR E SALVAMENTO','SISTEMA DE ESCORVA',
      'PRESSÃO DO CILINDRO DE NITROGÊNIO','01 CHAVE VÁLVULAS COMP. TRASEIRO',
      'NÍVEL DO TANQUE DE LGE','TRIÂNGULO DE SINALIZAÇÃO','EXTINTOR ABC 2KG',
      'ALAVANCA DE ELEVAÇÃO DA CABINE'
    ],
    nome_guerra_ba2: [
      '01 MANGUEIRA 1½" (30M) COMP. "R1"','01 MANGUEIRA 2½" (30M) COMP. "R1"',
      '01 CHAVE STORZ 1½" COMP. "R1"','01 REDUÇÃO 2½" PARA 1½" COMP. "R1"',
      '01 ESGUICHO "VR" COMP. "R1"','01 MANIVELA CARRETEL PQ COMP. "R2"',
      '01 MANGOTE PQ 1" (30M) COMP. "R2"','01 "PISTOLA" DE PQ COMP. "R2"',
      '01 MANGUEIRA 1½" (30M) COMP. "R2"','01 CHAVE STORZ 1½" COMP. "R2"',
      '02 CALÇOS COMP. "R2"','TAMPA CILINDRO "N2" COMP. "R2"',
      '01 CHAVE STORZ 1½" COMP. "L3"','01 MANIVELA CARRETEL PQ COMP. "L3"',
      '01 MANGOTE PQ 1" (30M) COMP. "L3"','01 "PISTOLA" DE PQ COMP. "L3"',
      '01 STECKLEITER COMP. "L3"','01 MANGUEIRA 1½" (30M) COMP. "L2"',
      '01 MANGUEIRA 2½" (30M) COMP. "L2"','02 CHAVE STORZ 1½" COMP. "L2"',
      '01 REDUÇÃO 2½" PARA 1½" COMP. "L2"','01 ESGUICHO "VR" COMP. "L2"',
      '02 CHAVES MANGOTE SUCÇÃO COMP. "L1"','02 CHAVES VÁLVULAS CORPO BOMBA COMP. "L1"',
      '01 CHAVE ANGULAR VÁLVULAS COMP. SUPERIOR','01 ESCADA EXTENSORA (4 PARTES) COMP. SUPERIOR',
      '02 MANGOTES 4" (SUCÇÃO) COMP. SUPERIOR','01 CHAVE CANHÃO TETO COMP. SUPERIOR',
      '01 RALO DE SUCÇÃO COMP. SUPERIOR','01 DERIVANTE 2½" PARA 2x1½" CABINE',
      'PRESILHA TAMPA TANQUE "LGE" COMP. SUPERIOR','PRESILHA TAMPA TANQUE ÁGUA COMP. SUPERIOR',
      '01 TELA TANQUE "LGE" COMP. SUPERIOR','01 TELA TANQUE ÁGUA COMP. SUPERIOR'
    ]
  }
};

const TIPO_LABEL = {
  motorista: 'Motorista',
  lider_resgate: 'Líder de Resgate',
  nome_guerra_ba2: 'BA-2'
};

async function gerarRelatorio() {
  const viatura = document.getElementById('sel-viatura').value;
  const tipo    = document.getElementById('sel-tipo').value;
  const mes     = document.getElementById('sel-mes').value;

  if (!viatura) { alert('Selecione uma viatura!'); return; }
  if (!mes)     { alert('Selecione o mês!'); return; }

  const container = document.getElementById('relatorio-container');
  container.innerHTML = '<div style="text-align:center;padding:40px;color:#888;">Carregando...</div>';

  try {
    const r = await fetch('/api/checklists/publico');
    const todos = await r.json();

    const filtrados = todos.filter(c =>
      c.placa === viatura &&
      c.formulario_id && c.formulario_id.includes(
        tipo === 'nome_guerra_ba2' ? 'ba' :
        tipo === 'lider_resgate' ? 'equipamentos' : 'motorista'
      ) &&
      c.mes === mes
    );

    const porDia = {};
    filtrados.forEach(c => {
      const dia = String(parseInt(c.dia)).padStart(2,'0');
      if (!porDia[dia]) porDia[dia] = [];
      porDia[dia].push(c);
    });

    const [ano, mesNum] = mes.split('-').map(Number);
    const totalDias = new Date(ano, mesNum, 0).getDate();
    const hoje = new Date();
    const diaHoje = (ano === hoje.getFullYear() && mesNum === hoje.getMonth()+1) ? hoje.getDate() : totalDias;
    const dias = Array.from({length: totalDias}, (_,i) => String(i+1).padStart(2,'0'));

    const itensForm = (ITENS[viatura] && ITENS[viatura][tipo]) || [];
    const mesNomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const mesLabel = mesNomes[mesNum-1] + '/' + ano;

    let html = `
    <div class="relatorio-wrap">
      <div class="rel-header">
        <div>
          <div style="font-size:10px;opacity:.7;margin-bottom:2px;">med+ Group — FORMULÁRIO MMS.BR.BA.FOR.007 — VERSÃO 00</div>
          <div class="rel-header-title">Checklist Inspeção — ${viatura} — ${TIPO_LABEL[tipo]}</div>
        </div>
        <div style="text-align:right;font-size:11px;opacity:.85;">
          <div>SCI: CUIABÁ</div>
          <div>MÊS: ${mesLabel}</div>
        </div>
      </div>
      <div class="rel-info">
        <span>VIATURA: <strong>${viatura}</strong></span>
        <span>MODELO: <strong>${filtrados[0]?.modelo || '—'}</strong></span>
        <span>PREENCHIDO POR: <strong>${TIPO_LABEL[tipo]}</strong></span>
        <span>DIAS PREENCHIDOS: <strong>${Object.keys(porDia).length} / ${diaHoje}</strong></span>
      </div>
      <div class="legenda">
        <strong>REFERÊNCIA:</strong>
        <span class="leg"><span class="leg-c">C</span> Conforme</span>
        <span class="leg"><span class="leg-nc">NC</span> Não Conforme</span>
        <span class="leg"><span class="leg-na">NA</span> Não Aplicável</span>
        <span style="margin-left:auto;font-size:10px;color:#888;">Impresso em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span>
      </div>
      <table class="rel-table">
        <thead>
          <tr>
            <th style="width:24px;">#</th>
            <th class="th-item">ITEM A INSPECIONAR</th>
            ${dias.map(d => `<th style="width:22px;${parseInt(d)>diaHoje?'color:#ccc;background:#fafafa':''}">${parseInt(d)}</th>`).join('')}
          </tr>
          <tr>
            <th colspan="2" style="text-align:left;padding:4px 8px;font-size:9px;font-weight:500;color:#888;">Preenchido por</th>
            ${dias.map(d => {
              const reg = porDia[d]?.[0];
              const vazio = parseInt(d) > diaHoje;
              if (vazio) return `<th style="background:#fafafa;color:#ddd;font-size:8px;">—</th>`;
              if (!reg)  return `<th style="background:#FEF3C7;color:#92400E;font-size:8px;">!</th>`;
              return `<th style="background:#E8F5E9;color:#2D7D32;font-size:8px;font-weight:500;" title="${reg.nome}">${reg.nome?.split(' ')[0]?.substring(0,4)||'✓'}</th>`;
            }).join('')}
          </tr>
        </thead>
        <tbody>`;

    itensForm.forEach((item, idx) => {
      html += `<tr>
        <td class="td-num">${idx+1}</td>
        <td class="td-item">${item}</td>
        ${dias.map(d => {
          const reg = porDia[d]?.[0];
          const vazio = parseInt(d) > diaHoje;
          if (vazio) return `<td class="cel-vazio">—</td>`;
          if (!reg) return `<td class="cel-vazio"></td>`;
          const status = reg.itens?.[`item-${idx}`]?.status;
          if (status === 'C')  return `<td class="cel-c">C</td>`;
          if (status === 'NC') return `<td class="cel-nc">NC</td>`;
          if (status === 'NA') return `<td class="cel-na">NA</td>`;
          return `<td class="cel-vazio">-</td>`;
        }).join('')}
      </tr>`;
    });

    html += `</tbody></table>`;

    const diasComReg = dias.filter(d => porDia[d]);
    if (diasComReg.length > 0) {
      html += `<div class="sig-footer" style="flex-wrap:wrap;gap:10px;">`;
      diasComReg.slice(0,10).forEach(d => {
        const reg = porDia[d][0];
        html += `<div class="sig-box" style="min-width:120px;max-width:150px;">
          <div class="sig-label">Dia ${parseInt(d)}</div>
          ${reg.sigMotorista ? `<img class="sig-img" src="${reg.sigMotorista}" alt="assinatura">` : '<div style="height:50px;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:10px;">sem assinatura</div>'}
          <div class="sig-nome">${reg.nome||'—'}</div>
        </div>`;
      });
      if (diasComReg.length > 10) {
        html += `<div style="display:flex;align-items:center;padding:10px;color:#888;font-size:12px;">+${diasComReg.length-10} assinaturas adicionais</div>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;

  } catch(e) {
    container.innerHTML = `<div style="background:#FEE2E2;color:#9B1C1C;padding:16px;border-radius:8px;">Erro: ${e.message}</div>`;
  }
}
</script>
</body>
</html>
