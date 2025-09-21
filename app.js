// =================== ARCHIPELAGO QR - SISTEMA MÉDICO DEDICADO ===================
// Versão 1.0 - Dezembro 2024

// =================== CONFIGURAÇÃO DA API ===================
const API_URL = 'https://script.google.com/macros/s/AKfycbxAEyQKas6IEFPV5iQK8HSjm-xIRfcczzB9poXEKpJhvYkmJZ6vaBN_x74IiBe-8wHC/exec';

// =================== DADOS GLOBAIS ===================
let hospitalData = {};
let currentHospital = null;
let currentLeito = null;
let timerInterval = null;
let timeLeft = 120; // 2 minutos em segundos

// =================== CONSTANTES ===================
const HOSPITAIS = {
    H1: 'Neomater',
    H2: 'Cruz Azul',
    H3: 'Santa Marcelina',
    H4: 'Santa Clara'
};

const CONCESSOES = [
    "Transição Domiciliar",
    "Aplicação domiciliar de medicamentos",
    "Fisioterapia",
    "Fonoaudiologia",
    "Aspiração",
    "Banho",
    "Curativos",
    "Oxigenoterapia",
    "Recarga de O2",
    "Orientação Nutricional - com dispositivo",
    "Orientação Nutricional - sem dispositivo",
    "Clister",
    "PICC"
];

const LINHAS_CUIDADO = [
    "Assiste",
    "APS",
    "Cuidados Paliativos",
    "ICO (Insuficiência Coronariana)",
    "Oncologia",
    "Pediatria",
    "Programa Autoimune - Gastroenterologia",
    "Programa Autoimune - Neuro-desmielinizante",
    "Programa Autoimune - Neuro-muscular",
    "Programa Autoimune - Reumatologia",
    "Vida Mais Leve Care",
    "Crônicos - Cardiologia",
    "Crônicos - Endocrinologia",
    "Crônicos - Geriatria",
    "Crônicos - Melhor Cuidado",
    "Crônicos - Neurologia",
    "Crônicos - Pneumologia",
    "Crônicos - Pós-bariátrica",
    "Crônicos - Reumatologia"
];

const PREVISAO_ALTA = [
    'Hoje Ouro', 'Hoje 2R', 'Hoje 3R',
    '24h Ouro', '24h 2R', '24h 3R',
    '48h', '72h', '96h', 'SP'
];

// =================== INICIALIZAÇÃO ===================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Archipelago QR - Inicializando...');
    
    // Obter parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const hospitalId = urlParams.get('h');
    const leitoNumero = urlParams.get('l');
    
    // Validar parâmetros
    if (!hospitalId || !leitoNumero) {
        showError('Acesso inválido. Use o QR Code do leito.');
        return;
    }
    
    // Validar hospital
    if (!HOSPITAIS[hospitalId]) {
        showError('Hospital não reconhecido.');
        return;
    }
    
    currentHospital = hospitalId;
    currentLeito = leitoNumero;
    
    console.log(`📍 Hospital: ${HOSPITAIS[hospitalId]}, Leito: ${leitoNumero}`);
    
    // Carregar dados do hospital
    await loadHospitalData(hospitalId);
});

// =================== CARREGAR DADOS ===================
async function loadHospitalData(hospitalId) {
    try {
        console.log('📡 Carregando dados da API...');
        
        // Usar action=all para buscar todos os dados
        const response = await fetch(`${API_URL}?action=all`);
        if (!response.ok) throw new Error('Erro ao carregar dados');
        
        const data = await response.json();
        if (!data.ok) throw new Error(data.error || 'Erro desconhecido');
        
        // Os dados vêm agrupados por hospital
        if (!data.data || !data.data[hospitalId]) {
            throw new Error(`Hospital ${hospitalId} não encontrado nos dados`);
        }
        
        // Armazenar dados do hospital
        hospitalData[hospitalId] = data.data[hospitalId];
        
        console.log('✅ Dados carregados:', hospitalData[hospitalId]);
        
        // Buscar leito específico
        const leito = hospitalData[hospitalId].leitos.find(l => 
            String(l.leito || l.numero) === String(currentLeito)
        );
        
        if (!leito) {
            showError(`Leito ${currentLeito} não encontrado no ${HOSPITAIS[hospitalId]}.`);
            return;
        }
        
        // Renderizar formulário
        renderForm(leito);
        
        // Iniciar timer
        startTimer();
        
        // Esconder loading
        hideLoading();
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        showError('Erro ao carregar dados do hospital. Tente novamente.');
    }
}

// =================== RENDERIZAR FORMULÁRIO ===================
function renderForm(leito) {
    const container = document.getElementById('mainContainer');
    const isVago = !leito.status || leito.status === 'Vago' || leito.status === 'vago';
    const hospitalNome = HOSPITAIS[currentHospital];
    
    container.innerHTML = `
        <!-- Header -->
        <div class="header">
            <div>
                <h1>Archipelago Medical</h1>
                <div class="hospital-info">🏥 ${hospitalNome} - Leito ${currentLeito}</div>
            </div>
            <div class="timer" id="timer">2:00</div>
        </div>
        
        <!-- Form Body -->
        <div class="form-body">
            <h2 class="form-title">${isVago ? '📝 ADMISSÃO DE PACIENTE' : '🔄 ATUALIZAÇÃO DE DADOS'}</h2>
            
            ${isVago ? `
                <!-- Formulário de Admissão -->
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nome Completo *</label>
                        <input type="text" id="nome" required>
                    </div>
                    <div class="form-group">
                        <label>Matrícula *</label>
                        <input type="text" id="matricula" required>
                    </div>
                    <div class="form-group">
                        <label>Idade *</label>
                        <input type="number" id="idade" min="0" max="120" required>
                    </div>
                </div>
            ` : `
                <!-- Formulário de Atualização -->
                <div class="form-grid">
                    <div class="form-group">
                        <label>Paciente</label>
                        <input type="text" value="${leito.nome || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Matrícula</label>
                        <input type="text" value="${leito.matricula || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Idade *</label>
                        <input type="number" id="idade" value="${leito.idade || ''}" min="0" max="120" required>
                    </div>
                </div>
            `}
            
            <!-- Campos Comuns -->
            <div class="form-grid">
                <div class="form-group">
                    <label>PPS % *</label>
                    <select id="pps" required>
                        <option value="">Selecionar...</option>
                        ${[10,20,30,40,50,60,70,80,90,100].map(v => 
                            `<option value="${v}" ${leito.pps == v ? 'selected' : ''}>${v}%</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>SPICT-BR *</label>
                    <select id="spict" required>
                        <option value="nao_elegivel" ${leito.spict === 'nao_elegivel' ? 'selected' : ''}>Não elegível</option>
                        <option value="elegivel" ${leito.spict === 'elegivel' ? 'selected' : ''}>Elegível</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Previsão Alta *</label>
                    <select id="prevAlta" required>
                        ${PREVISAO_ALTA.map(p => 
                            `<option value="${p}" ${leito.prevAlta === p ? 'selected' : ''}>${p}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            
            <!-- Concessões -->
            <div class="form-section">
                <div class="section-title">CONCESSÕES PREVISTAS NA ALTA</div>
                <div class="checkbox-grid">
                    ${CONCESSOES.map((c, i) => `
                        <div class="checkbox-item">
                            <input type="checkbox" id="conc${i}" value="${c}" 
                                ${leito.concessoes && leito.concessoes.includes(c) ? 'checked' : ''}>
                            <span>${c}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Linhas de Cuidado -->
            <div class="form-section">
                <div class="section-title">LINHAS DE CUIDADO PREVISTAS</div>
                <div class="checkbox-grid">
                    ${LINHAS_CUIDADO.map((l, i) => `
                        <div class="checkbox-item">
                            <input type="checkbox" id="linha${i}" value="${l}"
                                ${leito.linhas && leito.linhas.includes(l) ? 'checked' : ''}>
                            <span>${l}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Actions -->
        <div class="actions">
            <button class="btn btn-save" onclick="saveData()">
                ${isVago ? '✅ ADMITIR PACIENTE' : '💾 SALVAR ALTERAÇÕES'}
            </button>
            ${!isVago ? '<button class="btn btn-alta" onclick="darAlta()">🏠 DAR ALTA</button>' : ''}
            <button class="btn btn-cancel" onclick="cancelar()">❌ CANCELAR</button>
        </div>
    `;
    
    container.style.display = 'block';
}

// =================== TIMER DE 2 MINUTOS ===================
function startTimer() {
    timeLeft = 120;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerEl = document.getElementById('timer');
        
        if (timerEl) {
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Mudar cor conforme tempo
            if (timeLeft <= 30) {
                timerEl.className = 'timer danger';
            } else if (timeLeft <= 60) {
                timerEl.className = 'timer warning';
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('⏰ Tempo expirado! Escaneie o QR Code novamente.');
            window.location.href = '/';
        }
    }, 1000);
}

// =================== SALVAR DADOS ===================
async function saveData() {
    try {
        // Coletar dados
        const dados = coletarDados();
        
        // Validar
        if (!validarDados(dados)) return;
        
        // Determinar ação
        const leito = hospitalData[currentHospital].leitos.find(l => 
            String(l.leito || l.numero) === String(currentLeito)
        );
        const isVago = !leito.status || leito.status === 'Vago' || leito.status === 'vago';
        
        // Preparar payload - API usa 'admitir' e 'atualizar'
        const payload = {
            action: isVago ? 'admitir' : 'atualizar',
            hospital: currentHospital,
            leito: currentLeito,
            ...dados
        };
        
        // Enviar para API
        console.log('📤 Enviando dados:', payload);
        
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(payload)) {
            if (Array.isArray(value)) {
                params.append(key, value.join(','));
            } else if (value !== null && value !== undefined) {
                params.append(key, String(value));
            }
        }
        
        const response = await fetch(`${API_URL}?${params.toString()}`);
        const result = await response.json();
        
        if (!result.ok) throw new Error(result.error || 'Erro ao salvar');
        
        // Sucesso
        alert(`✅ ${isVago ? 'Paciente admitido' : 'Dados atualizados'} com sucesso!\n\nPara nova operação, escaneie o QR Code.`);
        window.location.href = '/';
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        alert('Erro ao salvar dados: ' + error.message);
    }
}

// =================== DAR ALTA ===================
async function darAlta() {
    if (!confirm('⚠️ Confirma a ALTA deste paciente?')) return;
    
    try {
        const params = new URLSearchParams({
            action: 'daralta',  // API usa 'daralta' não 'alta'
            hospital: currentHospital,
            leito: currentLeito
        });
        
        const response = await fetch(`${API_URL}?${params.toString()}`);
        const result = await response.json();
        
        if (!result.ok) throw new Error(result.error || 'Erro ao dar alta');
        
        alert('✅ Alta processada com sucesso!\n\nPara nova operação, escaneie o QR Code.');
        window.location.href = '/';
        
    } catch (error) {
        console.error('❌ Erro:', error);
        alert('Erro ao processar alta: ' + error.message);
    }
}

// =================== COLETAR DADOS DO FORMULÁRIO ===================
function coletarDados() {
    const dados = {};
    
    // Campos básicos
    const nome = document.getElementById('nome');
    if (nome) dados.nome = nome.value.trim();
    
    const matricula = document.getElementById('matricula');
    if (matricula) dados.matricula = matricula.value.trim();
    
    const idade = document.getElementById('idade');
    if (idade) dados.idade = parseInt(idade.value);
    
    dados.pps = document.getElementById('pps').value;
    dados.spict = document.getElementById('spict').value;
    dados.prevAlta = document.getElementById('prevAlta').value;
    dados.complexidade = 'I'; // Padrão
    
    // Concessões
    dados.concessoes = [];
    CONCESSOES.forEach((_, i) => {
        const cb = document.getElementById(`conc${i}`);
        if (cb && cb.checked) dados.concessoes.push(cb.value);
    });
    
    // Linhas de cuidado
    dados.linhas = [];
    LINHAS_CUIDADO.forEach((_, i) => {
        const cb = document.getElementById(`linha${i}`);
        if (cb && cb.checked) dados.linhas.push(cb.value);
    });
    
    return dados;
}

// =================== VALIDAR DADOS ===================
function validarDados(dados) {
    const erros = [];
    
    if (dados.nome !== undefined && !dados.nome) {
        erros.push('Nome é obrigatório');
    }
    
    if (dados.matricula !== undefined && !dados.matricula) {
        erros.push('Matrícula é obrigatória');
    }
    
    if (!dados.idade || dados.idade < 0 || dados.idade > 120) {
        erros.push('Idade inválida');
    }
    
    if (!dados.pps) erros.push('PPS é obrigatório');
    if (!dados.spict) erros.push('SPICT-BR é obrigatório');
    if (!dados.prevAlta) erros.push('Previsão de Alta é obrigatória');
    
    if (erros.length > 0) {
        alert('❌ Campos obrigatórios:\n\n• ' + erros.join('\n• '));
        return false;
    }
    
    return true;
}

// =================== CANCELAR ===================
function cancelar() {
    if (confirm('Deseja cancelar a operação?')) {
        alert('Operação cancelada.\n\nPara acessar um leito, escaneie o QR Code.');
        window.location.href = '/';
    }
}

// =================== UTILS ===================
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
}

function showError(message) {
    hideLoading();
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorContainer').style.display = 'block';
}

// =================== LOG ===================
console.log('✅ Archipelago QR System v1.0');
console.log('📱 Sistema dedicado para acesso médico via QR Code');
console.log('⏰ Timer de 2 minutos ativo');
