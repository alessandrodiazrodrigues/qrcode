// =================== API V4.1 - QR CODE MOBILE ===================
// Cliente: Guilherme Santoro
// Desenvolvedor: Alessandro Rodrigues
// Data: Novembro/2025
// Versão: V4.1 (Alinhado com Dashboard Principal)
// ✅ 7 hospitais | 93 leitos | 13 concessões (12 + "Não se aplica")
// ✅ 45 Linhas de Cuidado RESTAURADAS
// ✅ Sistema de normalização implementado
// ==================================================================================

// *** URL DA API V4.1 ***
const API_URL = 'https://script.google.com/macros/s/AKfycbzvPln452fG3MqgrA6r_06vgGA8ZDD7vmI1zTNKZ7ZGgkmg7Czjnvpur5CEx_MuOhtA/exec';

// =================== CONFIGURAÇÃO DE HOSPITAIS V4.1 (7 HOSPITAIS - 93 LEITOS) ===================
const HOSPITAIS = {
    H1: { nome: 'Neomater', leitos: 10 },
    H2: { nome: 'Cruz Azul', leitos: 36 },
    H3: { nome: 'Santa Marcelina', leitos: 7 },
    H4: { nome: 'Santa Clara', leitos: 13 },
    H5: { nome: 'Adventista', leitos: 13 },
    H6: { nome: 'Santa Cruz', leitos: 7 },
    H7: { nome: 'Santa Virgínia', leitos: 7 }
};

// =================== HOSPITAIS HÍBRIDOS V4.1 ===================
const HOSPITAIS_HIBRIDOS = ['H1', 'H3', 'H5', 'H6', 'H7'];

// =================== SANTA CLARA (LIMITE 4 ENFERMARIAS) ===================
const SANTA_CLARA_MAX_ENFERMARIAS = 4;

// =================== CRUZ AZUL - LEITOS IRMÃOS ===================
const CRUZ_AZUL_LEITOS_IRMAOS = {
    '21': '22', '22': '21',
    '23': '24', '24': '23',
    '25': '26', '26': '25',
    '27': '28', '28': '27',
    '29': '30', '30': '29',
    '31': '32', '32': '31',
    '33': '34', '34': '33',
    '35': '36', '36': '35'
};

// =================== CRUZ AZUL - NUMERAÇÃO FÍSICA ===================
const NUMERACAO_FIXA_CRUZ_AZUL = {
    '21': '711.1', '22': '711.2',
    '23': '713.1', '24': '713.2',
    '25': '715.1', '26': '715.2',
    '27': '717.1', '28': '717.2',
    '29': '719.1', '30': '719.2',
    '31': '721.1', '32': '721.2',
    '33': '723.1', '34': '723.2',
    '35': '725.1', '36': '725.2'
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

// =================== LINHAS DE CUIDADO (45 OPÇÕES - RESTAURADAS V4.1) ===================
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

// Mapas de exibição (SEM acentos → COM acentos)
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
console.log('✅ API.js V4.1 QR Code Mobile carregado');
console.log(`🔗 URL: ${API_URL}`);
console.log(`🏥 Hospitais: ${Object.keys(HOSPITAIS).length} (93 leitos)`);
console.log(`🎨 Cores: #60a5fa (azul vibrante) + #9ca3af (cinza)`);
console.log(`✍️ Fonte: Poppins Bold`);
console.log(`✅ Concessões: ${CONCESSOES.length} opções (12 + "Não se aplica")`);
console.log(`✅ Linhas de Cuidado: ${LINHAS_CUIDADO.length} opções RESTAURADAS`);
console.log(`✅ Sistema de normalização implementado`);
