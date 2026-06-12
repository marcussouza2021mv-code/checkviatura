const FORMULARIOS = {

  // ─────────────────────────────────────────────────────────────────
  // VIATURA CRS — IVECO DAILY
  // ─────────────────────────────────────────────────────────────────
  "CRS": {
    placa: "CRS",
    modelo: "IVECO DAILY",
    tipo: "ambulancia_resgate",
    formularios: [
      {
        id: "CRS_motorista",
        titulo: "Checklist Inspeção Viaturas — CRS",
        preenchidoPor: "motorista",
        secoes: [
          {
            nome: "Inspeção da Viatura",
            itens: [
              { num: 1,  item: "LATARIA, PINTURA" },
              { num: 2,  item: "LIMPEZA GERAL DO CARRO" },
              { num: 3,  item: "NÍVEL DO ÓLEO DO MOTOR" },
              { num: 4,  item: "NÍVEL DO FLUÍDO DE ARREFECIMENTO" },
              { num: 5,  item: "NÍVEL DO FLUÍDO DA DIREÇÃO" },
              { num: 6,  item: "IGNIÇÃO" },
              { num: 7,  item: "PARTIDA DO MOTOR" },
              { num: 8,  item: "PAINEL DE INSTRUMENTOS E ADVERTÊNCIA" },
              { num: 9,  item: "NÍVEL DE COMBUSTÍVEL" },
              { num: 10, item: "NÍVEL DO FLUÍDO DE FREIO" },
              { num: 11, item: "LIMPADOR DE PÁRA-BRISAS" },
              { num: 12, item: "FARÓIS" },
              { num: 13, item: "SETAS DIRECIONAIS" },
              { num: 14, item: "LUZ DE RÉ" },
              { num: 15, item: "COLETE E IMOBILIZAÇÃO" },
              { num: 16, item: "LUZ DE FREIO" },
              { num: 17, item: "PISCA ALERTA" },
              { num: 18, item: "ILUMINAÇÃO GERAL DA CABINE" },
              { num: 19, item: "RÁDIO TRANSCEPTOR" },
              { num: 20, item: "ILUMINAÇÃO EXTERNA" },
              { num: 21, item: "ILUMINAÇÃO INTERNA DO BAÚ" },
              { num: 22, item: "GIROFLEX" },
              { num: 23, item: "MEGAFONE" },
              { num: 24, item: "SIRENE" },
              { num: 25, item: "MAPA DE GRADE" },
              { num: 26, item: "BUZINA" },
              { num: 27, item: "CALIBRAGEM DOS PNEUS" },
              { num: 28, item: "DIREÇÃO" },
              { num: 29, item: "FREIOS" },
              { num: 30, item: "SUSPENSÃO" },
              { num: 31, item: "ENCAIXE CAIXA DE MARCHAS" },
              { num: 32, item: "TEMPERATURA DO MOTOR" },
              { num: 33, item: "CHAVE DE RODA" },
              { num: 34, item: "TRIÂNGULO DE SINALIZAÇÃO" },
              { num: 35, item: "MACACO" },
              { num: 36, item: "GUINCHO COMPLETO COM CONTROLE" },
              { num: 37, item: "TACÓGRAFO" },
              { num: 38, item: "TOMADA EXTERNA" }
            ]
          }
        ],
        assinaturas: ["motorista"]
      },
      {
        id: "CRS_equipamentos",
        titulo: "Checklist Inspeção Equipamentos — CRS",
        preenchidoPor: "lider_resgate",
        secoes: [
          {
            nome: "Equipamentos de Resgate",
            itens: [
              { num: 1,  item: "DESENCARCERADOR HIDRÁULICO" },
              { num: 2,  item: "SERRA CIRCULAR PARA CORTE PESADO DE METAL" },
              { num: 3,  item: "SERRA SABRE" },
              { num: 4,  item: "MACHADO DE RESGATE SEM CUNHA" },
              { num: 5,  item: "PÉ-DE-CABRA - 95 CM" },
              { num: 6,  item: "PÉ-DE-CABRA - 165 CM" },
              { num: 7,  item: "ESCADA EXTENSORA" },
              { num: 8,  item: "GANCHO OU GARRA DE SALVAMENTO" },
              { num: 9,  item: "FERRAMENTA DE CORTE DE CINTOS DE SEGURANÇA" },
              { num: 10, item: "MANTA RESISTENTE AO FOGO" },
              { num: 11, item: "TORRE DE ILUMINAÇÃO" },
              { num: 12, item: "LANTERNAS PORTÁTEIS" },
              { num: 13, item: "MACA RÍGIDA" },
              { num: 14, item: "COLAR CERVICAL RETRÁTIL" },
              { num: 15, item: "COLETE DE MOBILIZAÇÃO DORSO-LOMBAR MD KED" },
              { num: 16, item: "KIT MÉDICO PRIMEIROS SOCORROS" },
              { num: 17, item: "INALADOR DE OXIGÊNIO COM CILINDRO" },
              { num: 18, item: "CONJUNTO DE TALAS PARA IMOBILIZAÇÃO DE MEMBROS" }
            ]
          }
        ],
        assinaturas: ["motorista"]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // VIATURA 318 — IVECO MAGIRUS X6 — CCI: 02
  // ─────────────────────────────────────────────────────────────────
  "318": {
    placa: "DOSA 318",
    modelo: "IVECO MAGIRUS X6",
    cci: "02",
    tipo: "autobomba",
    formularios: [
      {
        id: "318_motorista",
        titulo: "Checklist Inspeção Viaturas — DOSA 318",
        preenchidoPor: "motorista",
        secoes: [
          {
            nome: "Inspeção da Viatura",
            itens: [
              { num: 1,  item: "LATARIA, PINTURA" },
              { num: 2,  item: "LIMPEZA GERAL DO CARRO" },
              { num: 3,  item: "NÍVEL DO ÓLEO DO MOTOR" },
              { num: 4,  item: "NÍVEL DO FLUÍDO DE ARREFECIMENTO" },
              { num: 5,  item: "NÍVEL DO ARLA 32 (PAINEL DE DIREÇÃO ADBLUE)" },
              { num: 6,  item: "REGULAGEM BANCO DO OPERADOR" },
              { num: 7,  item: "TACÓGRAFO" },
              { num: 8,  item: "IGNIÇÃO" },
              { num: 9,  item: "PARTIDA DO MOTOR" },
              { num: 10, item: "PAINEL DE INSTRUMENTOS E ADVERTÊNCIAS" },
              { num: 11, item: "NÍVEL DE COMBUSTÍVEL" },
              { num: 12, item: "BUZINA" },
              { num: 13, item: "LIMPADOR DE PÁRA-BRISAS" },
              { num: 14, item: "PÁRA-BRISAS E RETROVISORES" },
              { num: 15, item: "FARÓIS" },
              { num: 16, item: "SETAS DIRECIONAIS E PISCA ALERTA" },
              { num: 17, item: "LUZ DE RÉ, CIDADE E FREIO" },
              { num: 18, item: "ILUMINAÇÃO GERAL DA CABINE" },
              { num: 19, item: "RÁDIO TRANSCEPTOR E MEGAFONE" },
              { num: 20, item: "GIROFLEX E SIRENE" },
              { num: 21, item: "MAPA DE GRADE" },
              { num: 22, item: "ILUMINAÇÃO INTERNA COMPARTIMENTOS" },
              { num: 23, item: "ILUMINAÇÃO EXTERNA / LUZES DE TRABALHO" },
              { num: 24, item: "CALIBRAGEM DE PNEUS (VISUAL)" },
              { num: 25, item: "DIREÇÃO E SUSPENSÃO" },
              { num: 26, item: "FREIOS, FREIO ESTACIONÁRIO E FREIO MOTOR" },
              { num: 27, item: "ENCAIXE CAIXA DE MARCHAS" },
              { num: 28, item: "TEMPERATURA DO MOTOR E PRESSÃO DO ÓLEO" },
              { num: 29, item: "PAINÉIS DE OPERAÇÃO / TFT" },
              { num: 30, item: "NÍVEL DO TANQUE DE ÁGUA" },
              { num: 31, item: "PARTIDA DO MOTOR ESTACIONÁRIO" },
              { num: 32, item: "BOMBA DE INCÊNDIO" },
              { num: 33, item: "CANHÃO MONITOR DE TETO" },
              { num: 34, item: "CANHÃO MONITOR DE PÁRA-CHOQUE" },
              { num: 35, item: "COMANDOS JOYSTICK OPERADOR E SALVAMENTO" },
              { num: 36, item: "SISTEMA DE ESCORVA" },
              { num: 37, item: "PRESSÃO DO CILINDRO DE NITROGÊNIO" },
              { num: 38, item: "NÍVEL DO TANQUE DE LGE" },
              { num: 39, item: "TRIÂNGULO DE SINALIZAÇÃO" },
              { num: 40, item: "EXTINTOR ABC 2KG" },
              { num: 41, item: "CHAVE DE ABERTURA DAS VÁLVULAS DE PQ COMPARTIMENTO TRASEIRO" },
              { num: 42, item: "ALAVANCA DE ELEVAÇÃO DA CABINE" }
            ]
          }
        ],
        assinaturas: ["motorista"]
      },
      {
        id: "318_ba",
        titulo: "Check Externo BA — DOSA 318",
        preenchidoPor: "nome_guerra_ba2",
        secoes: [
          {
            nome: "Check Externo — Compartimentos",
            itens: [
              { num: 1,  item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"R1\"" },
              { num: 2,  item: "01 MANGUEIRA DE 2½\" (30 METROS) COMPARTIMENTO \"R1\"" },
              { num: 3,  item: "01 CHAVE STORZ DE 1½\", COMPARTIMENTO \"R1\"" },
              { num: 4,  item: "01 REDUÇÃO DE 2½\" PARA 1½\", COMPARTIMENTO \"R1\"" },
              { num: 5,  item: "01 ESGUICHO \"VR\", COMPARTIMENTO \"R1\"" },
              { num: 6,  item: "01 MANIVELA DO CARRETEL DE \"PQ\" COMPARTIMENTO \"R2\"" },
              { num: 7,  item: "01 MANGOTE DE PQ DE 1\" (30M), COMPARTIMENTO \"R2\"" },
              { num: 8,  item: "01 \"PISTOLA\" DE PQ, COMPARTIMENTO \"R2\"" },
              { num: 9,  item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"R2\"" },
              { num: 10, item: "01 CHAVE STORZ DE 1½\", COMPARTIMENTO \"R2\"" },
              { num: 11, item: "02 CALÇOS, COMPARTIMENTO \"R2\"" },
              { num: 12, item: "TAMPA DO CILINDRO DE \"N2\", COMPARTIMENTO \"R2\"" },
              { num: 13, item: "01 CHAVE STORZ DE 1½\", COMPARTIMENTO \"L3\"" },
              { num: 14, item: "01 MANIVELA DO CARRETEL DE \"PQ\" COMPARTIMENTO \"L3\"" },
              { num: 15, item: "01 MANGOTE DE PQ 1\" (30M) COMPARTIMENTO \"L3\"" },
              { num: 16, item: "01 \"PISTOLA\" DE PQ, COMPARTIMENTO \"L3\"" },
              { num: 17, item: "01 STECKLEITER (ESCADA DE APOIO), COMPARTIMENTO \"L3\"" },
              { num: 18, item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"L2\"" },
              { num: 19, item: "01 MANGUEIRA DE 2½\" (30 METROS) COMPARTIMENTO \"L2\"" },
              { num: 20, item: "02 CHAVE STORZ DE 1½\", COMPARTIMENTO \"L2\"" },
              { num: 21, item: "01 REDUÇÃO DE 2½\" PARA 1½\", COMPARTIMENTO \"L2\"" },
              { num: 22, item: "01 ESGUICHO \"VR\", COMPARTIMENTO \"L2\"" },
              { num: 23, item: "02 CHAVES MANGOTE SUCÇÃO, COMPARTIMENTO \"L1\"" },
              { num: 24, item: "02 CHAVES VÁLVULAS CORPO BOMBA, COMPARTIMENTO \"L1\"" },
              { num: 25, item: "01 CHAVE ANGULAR VÁLVULAS, COMPARTIMENTO SUPERIOR" },
              { num: 26, item: "01 ESCADA EXTENSORA (4 PARTES), COMPARTIMENTO SUPERIOR" },
              { num: 27, item: "02 MANGOTES DE 4\" (SUCÇÃO), COMPARTIMENTO SUPERIOR" },
              { num: 28, item: "01 CHAVE CANHÃO TETO, COMPARTIMENTO SUPERIOR" },
              { num: 29, item: "01 RALO DE SUCÇÃO, COMPARTIMENTO SUPERIOR" },
              { num: 30, item: "01 DERIVANTE DE 2½\" PARA 2x1½\", CABINE" },
              { num: 31, item: "01 PRESILHA TAMPA TANQUE \"LGE\", COMPARTIMENTO SUPERIOR" },
              { num: 32, item: "01 PRESILHA TAMPA TANQUE ÁGUA, COMPARTIMENTO SUPERIOR" },
              { num: 33, item: "01 TELA TANQUE \"LGE\", COMPARTIMENTO SUPERIOR" },
              { num: 34, item: "01 TELA TANQUE ÁGUA, COMPARTIMENTO SUPERIOR" }
            ]
          }
        ],
        assinaturas: ["motorista"]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // VIATURA AP-2 — FÊNIX — CCI: 03
  // ─────────────────────────────────────────────────────────────────
  "AP2": {
    placa: "AP-2",
    modelo: "FÊNIX",
    cci: "03",
    tipo: "autobomba",
    formularios: [
      {
        id: "AP2_motorista",
        titulo: "Checklist Inspeção Viaturas — AP-2",
        preenchidoPor: "motorista",
        secoes: [
          {
            nome: "Inspeção da Viatura",
            itens: [
              { num: 1,  item: "LATARIA, PINTURA" },
              { num: 2,  item: "LIMPEZA GERAL DO CARRO" },
              { num: 3,  item: "NÍVEL DO ÓLEO DO MOTOR" },
              { num: 4,  item: "NÍVEL DO FLUÍDO DE ARREFECIMENTO" },
              { num: 5,  item: "NÍVEL DO ARLA 32 (PAINEL DE DIREÇÃO ADBLUE)" },
              { num: 6,  item: "REGULAGEM BANCO DO OPERADOR" },
              { num: 7,  item: "TACÓGRAFO" },
              { num: 8,  item: "IGNIÇÃO" },
              { num: 9,  item: "PARTIDA DO MOTOR" },
              { num: 10, item: "PAINEL DE INSTRUMENTOS E ADVERTÊNCIAS" },
              { num: 11, item: "NÍVEL DE COMBUSTÍVEL" },
              { num: 12, item: "BUZINA" },
              { num: 13, item: "LIMPADOR DE PÁRA-BRISAS" },
              { num: 14, item: "PÁRA-BRISAS E RETROVISORES" },
              { num: 15, item: "FARÓIS" },
              { num: 16, item: "SETAS DIRECIONAIS E PISCA ALERTA" },
              { num: 17, item: "LUZ DE RÉ, CIDADE E FREIO" },
              { num: 18, item: "ILUMINAÇÃO GERAL DA CABINE" },
              { num: 19, item: "RÁDIO TRANSCEPTOR" },
              { num: 20, item: "MEGAFONE" },
              { num: 21, item: "GIROFLEX E SIRENE" },
              { num: 22, item: "MAPA DE GRADE" },
              { num: 23, item: "ILUMINAÇÃO EXTERNA / LUZES DE TRABALHO" },
              { num: 24, item: "CALIBRAGEM DE PNEUS (VISUAL)" },
              { num: 25, item: "DIREÇÃO E SUSPENSÃO" },
              { num: 26, item: "FREIOS, FREIO ESTACIONÁRIO E FREIO MOTOR" },
              { num: 27, item: "ENCAIXE CAIXA DE MARCHAS" },
              { num: 28, item: "TEMPERATURA DO MOTOR E PRESSÃO DO ÓLEO" },
              { num: 29, item: "NÍVEL DO TANQUE DE ÁGUA" },
              { num: 30, item: "BOMBA DE INCÊNDIO" },
              { num: 31, item: "CANHÃO MONITOR DE TETO" },
              { num: 32, item: "CANHÃO MONITOR DE PÁRA-CHOQUE" },
              { num: 33, item: "COMANDOS JOYSTICK" },
              { num: 34, item: "SISTEMA DE ESCORVA" },
              { num: 35, item: "PRESSÃO DO CILINDRO DE NITROGÊNIO" },
              { num: 36, item: "NÍVEL DO TANQUE DE LGE" },
              { num: 37, item: "TRIÂNGULO DE SINALIZAÇÃO" },
              { num: 38, item: "EXTINTOR ABC 2KG" },
              { num: 39, item: "ALAVANCA DE ELEVAÇÃO DA CABINE" }
            ]
          }
        ],
        assinaturas: ["motorista"]
      },
      {
        id: "AP2_ba",
        titulo: "Check Externo BA — AP-2",
        preenchidoPor: "nome_guerra_ba2",
        secoes: [
          {
            nome: "Check Externo — Compartimentos",
            itens: [
              { num: 1,  item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"R1\"" },
              { num: 2,  item: "01 ESGUICHO \"VR\" (DUPLA REGULAGEM), COMPARTIMENTO \"R1\"" },
              { num: 3,  item: "02 CHAVES STORZ (01 DUPLA E 01 SIMPLES) COMPARTIMENTO \"R1\"" },
              { num: 4,  item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"R2\"" },
              { num: 5,  item: "01 MANIVELA DO CARRETEL DE \"PQ\" COMPARTIMENTO \"R2\"" },
              { num: 6,  item: "01 MANGOTE DE PQ DE 1\" (30M), COMPARTIMENTO \"R2\"" },
              { num: 7,  item: "01 \"PISTOLA\" DE PQ, COMPARTIMENTO \"R2\"" },
              { num: 8,  item: "01 CHAVE DE ABERTURA MANUAL DO CANHÃO SUPERIOR, COMPARTIMENTO TRASEIRO" },
              { num: 9,  item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"L1\"" },
              { num: 10, item: "01 ESGUICHO \"VR\" (DUPLA REGULAGEM), COMPARTIMENTO \"L1\"" },
              { num: 11, item: "02 CHAVES STORZ (01 DUPLA E 01 SIMPLES), COMPARTIMENTO \"L1\"" },
              { num: 12, item: "01 ESCADA EXTENSORA, COMPARTIMENTO SUPERIOR" },
              { num: 13, item: "02 MANGOTES DE 4\" (SUCÇÃO), COMPARTIMENTO SUPERIOR" },
              { num: 14, item: "01 RALO DE SUCÇÃO, COMPARTIMENTO SUPERIOR" },
              { num: 15, item: "01 PRESILHA DA TAMPA DO TANQUE DE \"LGE\", COMPARTIMENTO SUPERIOR" },
              { num: 16, item: "01 PRESILHA DA TAMPA DO TANQUE DE ÁGUA, COMPARTIMENTO SUPERIOR" },
              { num: 17, item: "01 TELA DO TANQUE DE \"LGE\", COMPARTIMENTO SUPERIOR" },
              { num: 18, item: "01 TELA DO TANQUE DE ÁGUA, COMPARTIMENTO SUPERIOR" }
            ]
          }
        ],
        assinaturas: ["motorista"]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // VIATURA 371 — IVECO MAGIRUS X6 — CCI: 01
  // ─────────────────────────────────────────────────────────────────
  "371": {
    placa: "DOSA 371",
    modelo: "IVECO MAGIRUS X6",
    cci: "01",
    tipo: "autobomba",
    formularios: [
      {
        id: "371_motorista",
        titulo: "Checklist Inspeção Viaturas — DOSA 371",
        preenchidoPor: "motorista",
        secoes: [
          {
            nome: "Inspeção da Viatura",
            itens: [
              { num: 1,  item: "LATARIA, PINTURA" },
              { num: 2,  item: "LIMPEZA GERAL DO CARRO" },
              { num: 3,  item: "NÍVEL DO ÓLEO DO MOTOR" },
              { num: 4,  item: "NÍVEL DO FLUÍDO DE ARREFECIMENTO" },
              { num: 5,  item: "NÍVEL DO ARLA 32 (PAINEL DE DIREÇÃO ADBLUE)" },
              { num: 6,  item: "REGULAGEM BANCO DO OPERADOR" },
              { num: 7,  item: "TACÓGRAFO" },
              { num: 8,  item: "IGNIÇÃO" },
              { num: 9,  item: "PARTIDA DO MOTOR" },
              { num: 10, item: "PAINEL DE INSTRUMENTOS E ADVERTÊNCIAS" },
              { num: 11, item: "NÍVEL DE COMBUSTÍVEL" },
              { num: 12, item: "BUZINA" },
              { num: 13, item: "LIMPADOR DE PÁRA-BRISAS" },
              { num: 14, item: "PÁRA-BRISAS E RETROVISORES" },
              { num: 15, item: "FARÓIS" },
              { num: 16, item: "SETAS DIRECIONAIS E PISCA ALERTA" },
              { num: 17, item: "LUZ DE RÉ, CIDADE E FREIO" },
              { num: 18, item: "ILUMINAÇÃO GERAL DA CABINE" },
              { num: 19, item: "RÁDIO TRANSCEPTOR E MEGAFONE" },
              { num: 20, item: "GIROFLEX E SIRENE" },
              { num: 21, item: "MAPA DE GRADE" },
              { num: 22, item: "ILUMINAÇÃO INTERNA COMPARTIMENTOS" },
              { num: 23, item: "ILUMINAÇÃO EXTERNA / LUZES DE TRABALHO" },
              { num: 24, item: "CALIBRAGEM DE PNEUS (VISUAL)" },
              { num: 25, item: "DIREÇÃO E SUSPENSÃO" },
              { num: 26, item: "FREIOS, FREIO ESTACIONÁRIO E FREIO MOTOR" },
              { num: 27, item: "ENCAIXE CAIXA DE MARCHAS" },
              { num: 28, item: "TEMPERATURA DO MOTOR E PRESSÃO DO ÓLEO" },
              { num: 29, item: "PAINÉIS DE OPERAÇÃO / TFT" },
              { num: 30, item: "NÍVEL DO TANQUE DE ÁGUA" },
              { num: 31, item: "PARTIDA DO MOTOR ESTACIONÁRIO" },
              { num: 32, item: "BOMBA DE INCÊNDIO" },
              { num: 33, item: "CANHÃO MONITOR DE TETO" },
              { num: 34, item: "CANHÃO MONITOR DE PÁRA-CHOQUE" },
              { num: 35, item: "COMANDOS JOYSTICK OPERADOR E SALVAMENTO" },
              { num: 36, item: "SISTEMA DE ESCORVA" },
              { num: 37, item: "PRESSÃO DO CILINDRO DE NITROGÊNIO" },
              { num: 38, item: "01 CHAVE DE ABERTURA MANUAL DAS VÁLVULAS DE PQ, COMPARTIMENTO TRASEIRO" },
              { num: 39, item: "NÍVEL DO TANQUE DE LGE" },
              { num: 40, item: "TRIÂNGULO DE SINALIZAÇÃO" },
              { num: 41, item: "01 CHAVE DE ABERTURA MANUAL DAS VÁLVULAS DE PC, COMPARTIMENTO TRASEIRO" },
              { num: 42, item: "ALAVANCA DE ELEVAÇÃO DA CABINE" }
            ]
          }
        ],
        assinaturas: ["motorista"]
      },
      {
        id: "371_ba",
        titulo: "Check Externo BA — DOSA 371",
        preenchidoPor: "nome_guerra_ba2",
        secoes: [
          {
            nome: "Check Externo — Compartimentos",
            itens: [
              { num: 1,  item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"R1\"" },
              { num: 2,  item: "01 MANGUEIRA DE 2½\" (30 METROS) COMPARTIMENTO \"R1\"" },
              { num: 3,  item: "01 CHAVE STORZ DE 1½\", COMPARTIMENTO \"R1\"" },
              { num: 4,  item: "01 REDUÇÃO DE 2½\" PARA 1½\", COMPARTIMENTO \"R1\"" },
              { num: 5,  item: "01 ESGUICHO \"VR\", COMPARTIMENTO \"R1\"" },
              { num: 6,  item: "01 MANIVELA DO CARRETEL DE \"PQ\" COMPARTIMENTO \"R2\"" },
              { num: 7,  item: "01 MANGOTE DE PQ DE 1\" (30M), COMPARTIMENTO \"R2\"" },
              { num: 8,  item: "01 \"PISTOLA\" DE PQ, COMPARTIMENTO \"R2\"" },
              { num: 9,  item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"R2\"" },
              { num: 10, item: "01 CHAVE STORZ DE 1½\", COMPARTIMENTO \"R2\"" },
              { num: 11, item: "02 CALÇOS, COMPARTIMENTO \"R2\"" },
              { num: 12, item: "TAMPA DO CILINDRO DE \"N2\", COMPARTIMENTO \"R2\"" },
              { num: 13, item: "01 CHAVE STORZ DE 1½\", COMPARTIMENTO \"L3\"" },
              { num: 14, item: "01 MANIVELA DO CARRETEL DE \"PQ\" COMPARTIMENTO \"L3\"" },
              { num: 15, item: "01 MANGOTE DE PQ 1\" (30M) COMPARTIMENTO \"L3\"" },
              { num: 16, item: "01 \"PISTOLA\" DE PQ, COMPARTIMENTO \"L3\"" },
              { num: 17, item: "01 STECKLEITER (ESCADA DE APOIO), COMPARTIMENTO \"L3\"" },
              { num: 18, item: "01 MANGUEIRA DE 1½\" (30 METROS) COMPARTIMENTO \"L2\"" },
              { num: 19, item: "01 MANGUEIRA DE 2½\" (30 METROS) COMPARTIMENTO \"L2\"" },
              { num: 20, item: "02 CHAVE STORZ DE 1½\", COMPARTIMENTO \"L2\"" },
              { num: 21, item: "01 REDUÇÃO DE 2½\" PARA 1½\", COMPARTIMENTO \"L2\"" },
              { num: 22, item: "01 ESGUICHO \"VR\", COMPARTIMENTO \"L2\"" },
              { num: 23, item: "02 CHAVES MANGOTE SUCÇÃO, COMPARTIMENTO \"L1\"" },
              { num: 24, item: "02 CHAVES VÁLVULAS CORPO BOMBA, COMPARTIMENTO \"L1\"" },
              { num: 25, item: "01 CHAVE ANGULAR VÁLVULAS, COMPARTIMENTO SUPERIOR" },
              { num: 26, item: "01 ESCADA EXTENSORA (4 PARTES), COMPARTIMENTO SUPERIOR" },
              { num: 27, item: "02 MANGOTES DE 4\" (SUCÇÃO), COMPARTIMENTO SUPERIOR" },
              { num: 28, item: "01 CHAVE CANHÃO TETO, COMPARTIMENTO SUPERIOR" },
              { num: 29, item: "01 RALO DE SUCÇÃO, COMPARTIMENTO SUPERIOR" },
              { num: 30, item: "01 DERIVANTE DE 2½\" PARA 2x1½\", CABINE" },
              { num: 31, item: "01 PRESILHA TAMPA TANQUE \"LGE\", COMPARTIMENTO SUPERIOR" },
              { num: 32, item: "01 PRESILHA TAMPA TANQUE ÁGUA, COMPARTIMENTO SUPERIOR" },
              { num: 33, item: "01 TELA TANQUE \"LGE\", COMPARTIMENTO SUPERIOR" },
              { num: 34, item: "01 TELA TANQUE ÁGUA, COMPARTIMENTO SUPERIOR" }
            ]
          }
        ],
        assinaturas: ["motorista"]
      }
    ]
  }
};
