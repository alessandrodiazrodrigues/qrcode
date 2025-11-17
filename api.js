// =================== API V6.0 - QR CODE MOBILE ===================
// Cliente: Guilherme Santoro
// Desenvolvedor: Alessandro Rodrigues
// Data: Novembro/2025
// Versão: V6.0 (Alinhado com Dashboard Principal)
// 9 hospitais ativos | 341 leitos | 13 concessões | 45 Linhas de Cuidado
// Sistema de leitos irmãos: H2 (13 pares) + H4 (9 pares)
// ⚠️ URLs DE PRODUÇÃO - Em uso
// ==================================================================================

// *** URL DA API V6.0 - PRODUÇÃO ***
const API_URL = 'https://script.google.com/macros/s/AKfycbzUfGJXoX6sEfdMjvz7XUBDIYzpoxxclefTnm7BnIwwOWvre2MJc-7PlE16DjqHugMpdA/exec';

// =================== CONFIGURAÇÃO DE HOSPITAIS V6.0 (9 ATIVOS - 341 LEITOS) ===================
const HOSPITAIS = {
    H1: { nome: 'Neomater', leitos: 25 },
    H2: { nome: 'Cruz Azul', leitos: 67 },
    H3: { nome: 'Santa Marcelina', leitos: 28 },
    H4: { nome: 'Santa Clara', leitos: 57 },
    H5: { nome: 'Adventista', leitos: 28 },
    H6: { nome: 'Santa Cruz', leitos: 22 },
    H7: { nome: 'Santa Virgínia', leitos: 22 },
    H8: { nome: 'São Camilo Ipiranga', leitos: 22 },
    H9: { nome: 'São Camilo Pompéia', leitos: 22 }
};

// =================== HOSPITAIS HÍBRIDOS V6.0 ===================
const HOSPITAIS_HIBRIDOS = ['H1', 'H3', 'H5', 'H6', 'H7', 'H8', 'H9'];

// =================== CRUZ AZUL - LEITOS IRMÃOS (13 PARES) ===================
const CRUZ_AZUL_LEITOS_IRMAOS = {
    // Contratuais (8 pares: 21-36)
    '21': '22', '22': '21',
    '23': '24', '24': '23',
    '25': '26', '26': '25',
    '27': '28', '28': '27',
    '29': '30', '30': '29',
    '31': '32', '32': '31',
    '33': '34', '34': '33',
    '35': '36', '36': '35',
    // Extras (5 pares: 37-46)
    '37': '38', '38': '37',
    '39': '40', '40': '39',
    '41': '42', '42': '41',
    '43': '44', '44': '43',
    '45': '46', '46': '45'
};

// =================== SANTA CLARA - LEITOS IRMÃOS (9 PARES) ===================
const SANTA_CLARA_LEITOS_IRMAOS = {
    // Contratuais (4 pares: 10-17)
    '10': '11', '11': '10',
    '12': '13', '13': '12',
    '14': '15', '15': '14',
    '16': '17', '17': '16',
    // Extras (5 pares: 18-27)
    '18': '19', '19': '18',
    '20': '21', '21': '20',
    '22': '23', '23': '22',
    '24': '25', '25': '24',
    '26': '27', '27': '26'
};

// =================== OPÇÕES DE FORMULÁRIO ===================
const ISOLAMENTO_OPTIONS = [
    "Não Isolamento",
    "Isolamento de Contato", 
    "Isolamento Respiratório"
];

const REGIAO_OPTIONS = [
    'Zona Central',
    'Zona Sul',
    'Zona Norte',
    'Zona Leste',
    'Zona Oeste',
    'ABC',
    'Guarulhos',
    'Osasco',
    'Outra'
];

const SEXO_OPTIONS = [
    'Masculino',
    'Feminino'
];

const DIRETIVAS_OPTIONS = [
    'Não se aplica',
    'Sim',
    'Não'
];

const PREVISAO_ALTA = [
    'Hoje Ouro', 'Hoje 2R', 'Hoje 3R',
    '24h Ouro', '24h 2R', '24h 3R',
    '48h', '72h', '96h', 'Sem Previsão'
];

const PPS_OPTIONS = ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];
const IDADE_OPTIONS = Array.from({length: 102}, (_, i) => i + 14);

// =================== CONCESSÕES (13 OPÇÕES - 12 + "Não se aplica") ===================
const CONCESSOES = [
    "Não se aplica",
    "Transição Domiciliar",
    "Aplicação domiciliar de medicamentos",
    "Aspiração",
    "Banho",
    "Curativo",
    "Curativo PICC",
    "Fisioterapia Motora Domiciliar",
    "Fonoaudiologia Domiciliar",
    "Oxigenoterapia",
    "Remoção",
    "Solicitação domiciliar de exames",
    "Fisioterapia Respiratória Domiciliar"
];

// =================== LINHAS DE CUIDADO (45 OPÇÕES) ===================
const LINHAS_CUIDADO = [
    "Assiste",
    "APS SP",
    "Cuidados Paliativos",
    "ICO (Insuficiência Coronariana)",
    "Nexus SP Cardiologia",
    "Nexus SP Gastroentereologia",
    "Nexus SP Geriatria",
    "Nexus SP Pneumologia",
    "Nexus SP Psiquiatria",
    "Nexus SP Reumatologia",
    "Nexus SP Saúde do Fígado",
    "Generalista",
    "Bucomaxilofacial",
    "Cardiologia",
    "Cirurgia Cardíaca",
    "Cirurgia de Cabeça e Pescoço",
    "Cirurgia do Aparelho Digestivo",
    "Cirurgia Geral",
    "Cirurgia Oncológica",
    "Cirurgia Plástica",
    "Cirurgia Torácica",
    "Cirurgia Vascular",
    "Clínica Médica",
    "Coloproctologia",
    "Dermatologia",
    "Endocrinologia",
    "Fisiatria",
    "Gastroenterologia",
    "Geriatria",
    "Ginecologia e Obstetrícia",
    "Hematologia",
    "Infectologia",
    "Mastologia",
    "Nefrologia",
    "Neurocirurgia",
    "Neurologia",
    "Oftalmologia",
    "Oncologia Clínica",
    "Ortopedia",
    "Otorrinolaringologia",
    "Pediatria",
    "Pneumologia",
    "Psiquiatria",
    "Reumatologia",
    "Urologia"
];

// =================== SISTEMA DE NORMALIZAÇÃO/DESNORMALIZAÇÃO ===================
function normalizarTexto(texto) {
    if (!texto || typeof texto !== 'string') return texto;
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ç/g, 'c')
        .replace(/Ç/g, 'C');
}

const CONCESSOES_DISPLAY_MAP = {
    "Transicao Domiciliar": "Transição Domiciliar",
    "Aplicacao domiciliar de medicamentos": "Aplicação domiciliar de medicamentos",
    "Aspiracao": "Aspiração",
    "Banho": "Banho",
    "Curativo": "Curativo",
    "Curativo PICC": "Curativo PICC",
    "Fisioterapia Motora Domiciliar": "Fisioterapia Motora Domiciliar",
    "Fonoaudiologia Domiciliar": "Fonoaudiologia Domiciliar",
    "Oxigenoterapia": "Oxigenoterapia",
    "Remocao": "Remoção",
    "Solicitacao domiciliar de exames": "Solicitação domiciliar de exames",
    "Fisioterapia Respiratoria Domiciliar": "Fisioterapia Respiratória Domiciliar"
};

const LINHAS_DISPLAY_MAP = {
    "Assiste": "Assiste",
    "APS SP": "APS SP",
    "Cuidados Paliativos": "Cuidados Paliativos",
    "ICO (Insuficiencia Coronariana)": "ICO (Insuficiência Coronariana)",
    "Nexus SP Cardiologia": "Nexus SP Cardiologia",
    "Nexus SP Gastroentereologia": "Nexus SP Gastroentereologia",
    "Nexus SP Geriatria": "Nexus SP Geriatria",
    "Nexus SP Pneumologia": "Nexus SP Pneumologia",
    "Nexus SP Psiquiatria": "Nexus SP Psiquiatria",
    "Nexus SP Reumatologia": "Nexus SP Reumatologia",
    "Nexus SP Saude do Figado": "Nexus SP Saúde do Fígado",
    "Generalista": "Generalista",
    "Bucomaxilofacial": "Bucomaxilofacial",
    "Cardiologia": "Cardiologia",
    "Cirurgia Cardiaca": "Cirurgia Cardíaca",
    "Cirurgia de Cabeca e Pescoco": "Cirurgia de Cabeça e Pescoço",
    "Cirurgia do Aparelho Digestivo": "Cirurgia do Aparelho Digestivo",
    "Cirurgia Geral": "Cirurgia Geral",
    "Cirurgia Oncologica": "Cirurgia Oncológica",
    "Cirurgia Plastica": "Cirurgia Plástica",
    "Cirurgia Toracica": "Cirurgia Torácica",
    "Cirurgia Vascular": "Cirurgia Vascular",
    "Clinica Medica": "Clínica Médica",
    "Coloproctologia": "Coloproctologia",
    "Dermatologia": "Dermatologia",
    "Endocrinologia": "Endocrinologia",
    "Fisiatria": "Fisiatria",
    "Gastroenterologia": "Gastroenterologia",
    "Geriatria": "Geriatria",
    "Ginecologia e Obstetricia": "Ginecologia e Obstetrícia",
    "Hematologia": "Hematologia",
    "Infectologia": "Infectologia",
    "Mastologia": "Mastologia",
    "Nefrologia": "Nefrologia",
    "Neurocirurgia": "Neurocirurgia",
    "Neurologia": "Neurologia",
    "Oftalmologia": "Oftalmologia",
    "Oncologia Clinica": "Oncologia Clínica",
    "Ortopedia": "Ortopedia",
    "Otorrinolaringologia": "Otorrinolaringologia",
    "Pediatria": "Pediatria",
    "Pneumologia": "Pneumologia",
    "Psiquiatria": "Psiquiatria",
    "Reumatologia": "Reumatologia",
    "Urologia": "Urologia"
};

function desnormalizarTexto(texto) {
    if (!texto || typeof texto !== 'string') return texto;
    
    if (CONCESSOES_DISPLAY_MAP[texto]) {
        return CONCESSOES_DISPLAY_MAP[texto];
    }
    
    if (LINHAS_DISPLAY_MAP[texto]) {
        return LINHAS_DISPLAY_MAP[texto];
    }
    
    return texto;
}

// =================== LOGS ===================
console.log('✅ API.js V6.0 QR Code Mobile carregado');
console.log(`🔗 URL: ${API_URL}`);
console.log(`⚠️ URL DE PRODUÇÃO - Em uso`);
console.log(`🏥 Hospitais: ${Object.keys(HOSPITAIS).length} ativos (341 leitos)`);
console.log(`🎨 Cores: #60a5fa (azul vibrante) + #9ca3af (cinza)`);
console.log(`✏️ Fonte: Poppins Bold`);
console.log(`✅ Concessões: ${CONCESSOES.length} opções (12 + "Não se aplica")`);
console.log(`✅ Linhas de Cuidado: ${LINHAS_CUIDADO.length} opções`);
console.log(`✅ Sistema de normalização implementado`);
console.log(`👥 Leitos Irmãos H2: 13 pares (21-46)`);
console.log(`👥 Leitos Irmãos H4: 9 pares (10-27)`);
console.log(`📝 Campo anotações: 800 caracteres`);
console.log(`🔧 H2: 67 leitos (1-20 apto, 21-46 enf, 47-67 apto)`);
console.log(`🔧 H4: 57 leitos (1-9 apto, 10-27 enf, 28-57 apto)`);