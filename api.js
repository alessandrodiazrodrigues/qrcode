// =================== API V7.3 - QR CODE MOBILE ===================
// Cliente: Guilherme Santoro
// Desenvolvedor: Alessandro Rodrigues
// Data: Dezembro/2025
// Versao: V7.3 (SPICT-BR ativo na UTI)
// Novidades V7.3:
//   - SPICT-BR ativo na UTI (removido de campos bloqueados)
//   - Backend grava SPICT na coluna J para pacientes UTI
// Novidades V7.2:
//   - Verifica matricula duplicada no hospital antes de admitir
//   - Verifica se existe reserva para matricula ou leito
//   - Cancela reserva automaticamente se usuario confirmar
//   - Overlay de loading que bloqueia toda a tela
//   - Correcao isolamento leitos irmaos (com/sem acento)
// 9 hospitais ativos | 356 leitos (293 enfermaria + 63 UTI)
// Sistema de leitos irmaos: H2 (13 pares) + H4 (9pares)
// UTI: 8 hospitais com UTI (H7 nao tem)
// ==================================================================================

// *** URL DA API V7.3 - PRODUCAO ***
const API_URL = 'https://script.google.com/macros/s/AKfycbyQoJmIbYE4SLhRdZV2F_RMUpLSs1wAHbVYPhq8-Cadic5TJeV3uZILUCZZ5gR836eH/exec';

// =================== CONFIGURACAO DE HOSPITAIS V7.0 (9 ATIVOS - 293 LEITOS ENFERMARIA) ===================
const HOSPITAIS = {
    H1: { nome: 'Neomater', leitos: 25 },
    H2: { nome: 'Cruz Azul', leitos: 67 },
    H3: { nome: 'Santa Marcelina', leitos: 28 },
    H4: { nome: 'Santa Clara', leitos: 57 },
    H5: { nome: 'Adventista', leitos: 28 },
    H6: { nome: 'Santa Cruz', leitos: 22 },
    H7: { nome: 'Santa Virginia', leitos: 22 },
    H8: { nome: 'Sao Camilo Ipiranga', leitos: 22 },
    H9: { nome: 'Sao Camilo Pompeia', leitos: 22 }
};

// =================== CONFIGURACAO UTI V7.0 (8 HOSPITAIS - 63 LEITOS) ===================
const UTI_CAPACIDADE = {
    H1: { contratuais: 3, extras: 2, total: 5, nome: 'Neomater' },
    H2: { contratuais: 20, extras: 10, total: 30, nome: 'Cruz Azul' },
    H3: { contratuais: 2, extras: 2, total: 4, nome: 'Santa Marcelina' },
    H4: { contratuais: 4, extras: 2, total: 6, nome: 'Santa Clara' },
    H5: { contratuais: 4, extras: 2, total: 6, nome: 'Adventista' },
    H6: { contratuais: 2, extras: 2, total: 4, nome: 'Santa Cruz' },
    H7: { contratuais: 0, extras: 0, total: 0, nome: 'Santa Virginia' }, // SEM UTI
    H8: { contratuais: 2, extras: 2, total: 4, nome: 'Sao Camilo Ipiranga' },
    H9: { contratuais: 2, extras: 2, total: 4, nome: 'Sao Camilo Pompeia' }
};

// Hospitais com UTI ativa
const HOSPITAIS_UTI_ATIVOS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H8', 'H9'];

// =================== HOSPITAIS HIBRIDOS V7.0 ===================
const HOSPITAIS_HIBRIDOS = ['H1', 'H3', 'H5', 'H6', 'H7', 'H8', 'H9'];

// =================== CRUZ AZUL - LEITOS IRMAOS (13 PARES) ===================
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

// =================== SANTA CLARA - LEITOS IRMAOS (9 PARES) ===================
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

// =================== OPCOES DE FORMULARIO ===================
const ISOLAMENTO_OPTIONS = [
    "Nao Isolamento",
    "Isolamento de Contato", 
    "Isolamento Respiratorio"
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
    'Nao se aplica',
    'Sim',
    'Nao'
];

// Previsao de Alta - ENFERMARIAS (com turnos)
const PREVISAO_ALTA = [
    'Hoje Ouro', 'Hoje 2R', 'Hoje 3R',
    '24h Ouro', '24h 2R', '24h 3R',
    '48h', '72h', '96h', 'Sem Previsao'
];

// Previsao de Alta - UTI (sem turnos)
const PREVISAO_ALTA_UTI = [
    'Hoje', '24h', '48h', '72h', '96h', 'Sem Previsao'
];

const PPS_OPTIONS = ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];
const IDADE_OPTIONS = Array.from({length: 102}, (_, i) => i + 14);

// =================== CONCESSOES (13 OPCOES - 12 + "Nao se aplica") ===================
const CONCESSOES = [
    "Nao se aplica",
    "Transicao Domiciliar",
    "Aplicacao domiciliar de medicamentos",
    "Aspiracao",
    "Banho",
    "Curativo",
    "Curativo PICC",
    "Fisioterapia Motora Domiciliar",
    "Fonoaudiologia Domiciliar",
    "Oxigenoterapia",
    "Remocao",
    "Solicitacao domiciliar de exames",
    "Fisioterapia Respiratoria Domiciliar"
];

// =================== LINHAS DE CUIDADO (45 OPCOES) ===================
const LINHAS_CUIDADO = [
    "Assiste",
    "APS SP",
    "Cuidados Paliativos",
    "ICO (Insuficiencia Coronariana)",
    "Nexus SP Cardiologia",
    "Nexus SP Gastroentereologia",
    "Nexus SP Geriatria",
    "Nexus SP Pneumologia",
    "Nexus SP Psiquiatria",
    "Nexus SP Reumatologia",
    "Nexus SP Saude do Figado",
    "Generalista",
    "Bucomaxilofacial",
    "Cardiologia",
    "Cirurgia Cardiaca",
    "Cirurgia de Cabeca e Pescoco",
    "Cirurgia do Aparelho Digestivo",
    "Cirurgia Geral",
    "Cirurgia Oncologica",
    "Cirurgia Plastica",
    "Cirurgia Toracica",
    "Cirurgia Vascular",
    "Clinica Medica",
    "Coloproctologia",
    "Dermatologia",
    "Endocrinologia",
    "Fisiatria",
    "Gastroenterologia",
    "Geriatria",
    "Ginecologia e Obstetricia",
    "Hematologia",
    "Infectologia",
    "Mastologia",
    "Nefrologia",
    "Neurocirurgia",
    "Neurologia",
    "Oftalmologia",
    "Oncologia Clinica",
    "Ortopedia",
    "Otorrinolaringologia",
    "Pediatria",
    "Pneumologia",
    "Psiquiatria",
    "Reumatologia",
    "Urologia"
];

// =================== SISTEMA DE NORMALIZACAO/DESNORMALIZACAO ===================
function normalizarTexto(texto) {
    if (!texto || typeof texto !== 'string') return texto;
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\u00e7/g, 'c')
        .replace(/\u00c7/g, 'C');
}

const CONCESSOES_DISPLAY_MAP = {
    "Transicao Domiciliar": "Transicao Domiciliar",
    "Aplicacao domiciliar de medicamentos": "Aplicacao domiciliar de medicamentos",
    "Aspiracao": "Aspiracao",
    "Banho": "Banho",
    "Curativo": "Curativo",
    "Curativo PICC": "Curativo PICC",
    "Fisioterapia Motora Domiciliar": "Fisioterapia Motora Domiciliar",
    "Fonoaudiologia Domiciliar": "Fonoaudiologia Domiciliar",
    "Oxigenoterapia": "Oxigenoterapia",
    "Remocao": "Remocao",
    "Solicitacao domiciliar de exames": "Solicitacao domiciliar de exames",
    "Fisioterapia Respiratoria Domiciliar": "Fisioterapia Respiratoria Domiciliar"
};

const LINHAS_DISPLAY_MAP = {
    "Assiste": "Assiste",
    "APS SP": "APS SP",
    "Cuidados Paliativos": "Cuidados Paliativos",
    "ICO (Insuficiencia Coronariana)": "ICO (Insuficiencia Coronariana)",
    "Nexus SP Cardiologia": "Nexus SP Cardiologia",
    "Nexus SP Gastroentereologia": "Nexus SP Gastroentereologia",
    "Nexus SP Geriatria": "Nexus SP Geriatria",
    "Nexus SP Pneumologia": "Nexus SP Pneumologia",
    "Nexus SP Psiquiatria": "Nexus SP Psiquiatria",
    "Nexus SP Reumatologia": "Nexus SP Reumatologia",
    "Nexus SP Saude do Figado": "Nexus SP Saude do Figado",
    "Generalista": "Generalista",
    "Bucomaxilofacial": "Bucomaxilofacial",
    "Cardiologia": "Cardiologia",
    "Cirurgia Cardiaca": "Cirurgia Cardiaca",
    "Cirurgia de Cabeca e Pescoco": "Cirurgia de Cabeca e Pescoco",
    "Cirurgia do Aparelho Digestivo": "Cirurgia do Aparelho Digestivo",
    "Cirurgia Geral": "Cirurgia Geral",
    "Cirurgia Oncologica": "Cirurgia Oncologica",
    "Cirurgia Plastica": "Cirurgia Plastica",
    "Cirurgia Toracica": "Cirurgia Toracica",
    "Cirurgia Vascular": "Cirurgia Vascular",
    "Clinica Medica": "Clinica Medica",
    "Coloproctologia": "Coloproctologia",
    "Dermatologia": "Dermatologia",
    "Endocrinologia": "Endocrinologia",
    "Fisiatria": "Fisiatria",
    "Gastroenterologia": "Gastroenterologia",
    "Geriatria": "Geriatria",
    "Ginecologia e Obstetricia": "Ginecologia e Obstetricia",
    "Hematologia": "Hematologia",
    "Infectologia": "Infectologia",
    "Mastologia": "Mastologia",
    "Nefrologia": "Nefrologia",
    "Neurocirurgia": "Neurocirurgia",
    "Neurologia": "Neurologia",
    "Oftalmologia": "Oftalmologia",
    "Oncologia Clinica": "Oncologia Clinica",
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
console.log('API.js V7.3 QR Code Mobile carregado');
console.log('URL: ' + API_URL);
console.log('AMBIENTE DE PRODUCAO');
console.log('Hospitais: ' + Object.keys(HOSPITAIS).length + ' ativos');
console.log('Leitos Enfermaria: 293 | Leitos UTI: 63 | Total: 356');
console.log('UTI ativa em: ' + HOSPITAIS_UTI_ATIVOS.join(', '));
console.log('Leitos Irmaos H2: 13 pares (21-46)');
console.log('Leitos Irmaos H4: 9 pares (10-27)');
console.log('Prev Alta Enfermaria: com turnos (Ouro, 2R, 3R)');
console.log('Prev Alta UTI: sem turnos (Hoje, 24h, 48h, 72h, 96h, SP)');
console.log('V7.3: SPICT-BR ativo na UTI');
