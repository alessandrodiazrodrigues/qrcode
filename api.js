// =================== API V4.0 - QR CODE MOBILE ===================
// Cliente: Guilherme Santoro
// Desenvolvedor: Alessandro Rodrigues
// Data: Novembro/2025
// Versão: V4.0 (Alinhado com Dashboard Principal)
// =================== CHANGELOG V3.3 → V4.0 ===================
// ✅ Cores atualizadas: #60a5fa + #9ca3af
// ✅ Adicionados H6 (Santa Cruz) e H7 (Santa Virgínia)
// ✅ Total: 7 hospitais | 93 leitos
// ✅ Linhas de Cuidado inibidas na UI (mantidas no backend)
// ✅ URL da API atualizada
// ✅ Fonte Poppins Bold
// ==================================================================================

// *** URL DA API V4.0 ***
const API_URL = 'https://script.google.com/macros/s/AKfycbxduw4WmDBu_SNJnDJ6WCR1M4kOAtibKeXd2IwBJ3HpImiHtricIlxyxdYpBp6g3UzJ/exec';

// =================== CONFIGURAÇÃO DE HOSPITAIS V4.0 (7 HOSPITAIS - 93 LEITOS) ===================
const HOSPITAIS = {
    H1: { nome: 'Neomater', leitos: 10 },
    H2: { nome: 'Cruz Azul', leitos: 36 },
    H3: { nome: 'Santa Marcelina', leitos: 7 },
    H4: { nome: 'Santa Clara', leitos: 13 },
    H5: { nome: 'Adventista', leitos: 13 },
    H6: { nome: 'Santa Cruz', leitos: 7 },      // ✅ NOVO V4.0
    H7: { nome: 'Santa Virgínia', leitos: 7 }   // ✅ NOVO V4.0
};

// =================== HOSPITAIS HÍBRIDOS V4.0 ===================
const HOSPITAIS_HIBRIDOS = ['H1', 'H3', 'H5', 'H6', 'H7']; // ✅ +H6 e H7

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

// =================== CONCESSÕES (12 OPÇÕES - VISÍVEL NA UI) ===================
const CONCESSOES = [
    "Não se aplica",
    "Transição Domiciliar",
    "Aplicação domiciliar de medicamentos",
    "Aspiração",
    "Banho",
    "Curativo",
    "Curativo PICC",
    "Fisioterapia Domiciliar",
    "Fonoaudiologia Domiciliar",
    "Oxigenoterapia",
    "Remoção",
    "Solicitação domiciliar de exames"
];

// =================== LINHAS DE CUIDADO (45 OPÇÕES - INIBIDA NA UI V4.0) ===================
// ⚠️ MANTIDO NO CÓDIGO PARA COMPATIBILIDADE COM BACKEND
// ⚠️ NÃO É RENDERIZADO NA INTERFACE (ver função renderForm)
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

// =================== LOGS ===================
console.log('✅ API.js V4.0 QR Code Mobile carregado');
console.log(`🔗 URL: ${API_URL}`);
console.log(`🏥 Hospitais: ${Object.keys(HOSPITAIS).length} (93 leitos)`);
console.log(`🎨 Cores: #60a5fa (azul vibrante) + #9ca3af (cinza)`);
console.log(`✍️ Fonte: Poppins Bold`);
console.log(`🚫 Linhas de Cuidado: INIBIDAS na UI`);
console.log(`✅ Concessões: VISÍVEIS (${CONCESSOES.length} opções)`);
