// Configuração da API
const API_CONFIG = {
    baseUrl: 'http://localhost:8081/api/funcionarios',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Elementos DOM
const elements = {
    formCadastro: document.getElementById('formCadastro'),
    tabelaFuncionarios: document.getElementById('tabelaFuncionarios'),
    alertArea: document.getElementById('alertArea'),
    confirmDeleteModal: document.getElementById('confirmDeleteModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    
    // Novos elementos do menu e busca
    tabCadastro: document.getElementById('tabCadastro'),
    tabListagem: document.getElementById('tabListagem'),
    cadastroSection: document.getElementById('cadastroSection'),
    listagemSection: document.getElementById('listagemSection'),
    searchNome: document.getElementById('searchNome'),
    filterSetor: document.getElementById('filterSetor'),
    btnLimparFiltros: document.getElementById('btnLimparFiltros')
};

// Estado da aplicação
let appState = {
    funcionarios: [],
    funcionariosFiltrados: [],
    idParaExcluir: null,
    isLoading: false,
    filtros: {
        nome: '',
        setor: ''
    }
};

// Utilitários
const Utils = {
    // Formatar CPF
    formatCPF(cpf) {
        return cpf.replace(/\D/g, '')
                 .replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                 .replace(/(-\d{2})\d+?$/, '$1');
    },

    // Formatar telefone
    formatTelefone(telefone) {
        return telefone.replace(/\D/g, '')
                      .replace(/(\d{2})(\d)/, '($1) $2')
                      .replace(/(\d{4})(\d)/, '$1-$2')
                      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
                      .replace(/(-\d{4})\d+?$/, '$1');
    },

    // Validar CPF
    validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digito1 = resto < 2 ? 0 : resto;

        if (parseInt(cpf.charAt(9)) !== digito1) {
            return false;
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digito2 = resto < 2 ? 0 : resto;

        return parseInt(cpf.charAt(10)) === digito2;
    },

    // Validar email
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Formatar data para exibição
    formatarData(data) {
        if (!data) return 'N/A';
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR');
    },

    // Formatar salário
    formatarSalario(salario) {
        if (!salario) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(salario);
    }
};

// Gerenciador de Alertas
const AlertManager = {
    show(message, type = 'success') {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const alertHTML = `
            <div class="alert ${alertClass}">
                ${message}
                <button type="button" class="alert-close" onclick="this.parentElement.remove()">
                    &times;
                </button>
            </div>
        `;
        
        elements.alertArea.innerHTML = alertHTML;
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            const alert = elements.alertArea.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    },

    clear() {
        elements.alertArea.innerHTML = '';
    }
};

// Gerenciador de Modal
const ModalManager = {
    show() {
        elements.confirmDeleteModal.classList.add('show');
        elements.modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    hide() {
        elements.confirmDeleteModal.classList.remove('show');
        elements.modalOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
        appState.idParaExcluir = null;
    },

    init() {
        // Event listeners para fechar modal
        elements.cancelDeleteBtn.addEventListener('click', this.hide);
        elements.modalCloseBtn.addEventListener('click', this.hide);
        elements.modalOverlay.addEventListener('click', this.hide);
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.confirmDeleteModal.classList.contains('show')) {
                this.hide();
            }
        });
    }
};

// Gerenciador de Navegação
const NavigationManager = {
    init() {
        this.bindEvents();
        this.showTab('cadastro'); // Mostra a aba de cadastro por padrão
    },

    bindEvents() {
        elements.tabCadastro.addEventListener('click', () => this.showTab('cadastro'));
        elements.tabListagem.addEventListener('click', () => this.showTab('listagem'));
    },

    showTab(tabName) {
        // Remove classe active de todas as abas
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove classe active de todas as seções
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.remove('active');
        });

        // Ativa a aba e seção correspondente
        if (tabName === 'cadastro') {
            elements.tabCadastro.classList.add('active');
            elements.cadastroSection.classList.add('active');
        } else if (tabName === 'listagem') {
            elements.tabListagem.classList.add('active');
            elements.listagemSection.classList.add('active');
            // Carrega os funcionários quando a aba de listagem é aberta
            FuncionarioManager.carregarFuncionarios();
        }
    }
};

// Gerenciador de Filtros e Busca
const FilterManager = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Busca em tempo real
        elements.searchNome.addEventListener('input', (e) => {
            appState.filtros.nome = e.target.value.toLowerCase();
            this.aplicarFiltros();
        });

        // Filtro por setor
        elements.filterSetor.addEventListener('change', (e) => {
            appState.filtros.setor = e.target.value;
            this.aplicarFiltros();
        });

        // Botão limpar filtros
        elements.btnLimparFiltros.addEventListener('click', () => {
            this.limparFiltros();
        });
    },

    aplicarFiltros() {
        let funcionariosFiltrados = [...appState.funcionarios];

        // Filtro por nome
        if (appState.filtros.nome) {
            funcionariosFiltrados = funcionariosFiltrados.filter(funcionario =>
                funcionario.nome.toLowerCase().includes(appState.filtros.nome)
            );
        }

        // Filtro por setor
        if (appState.filtros.setor) {
            funcionariosFiltrados = funcionariosFiltrados.filter(funcionario =>
                funcionario.setor === appState.filtros.setor
            );
        }

        appState.funcionariosFiltrados = funcionariosFiltrados;
        FuncionarioManager.renderizarTabela(funcionariosFiltrados);
    },

    limparFiltros() {
        elements.searchNome.value = '';
        elements.filterSetor.value = '';
        appState.filtros.nome = '';
        appState.filtros.setor = '';
        appState.funcionariosFiltrados = [...appState.funcionarios];
        FuncionarioManager.renderizarTabela(appState.funcionarios);
    }
};

// Gerenciador de Funcionários
const FuncionarioManager = {
    async carregarFuncionarios() {
        try {
            appState.isLoading = true;
            elements.tabelaFuncionarios.innerHTML = '<tr><td colspan="6" class="loading">Carregando funcionários...</td></tr>';
            
            const response = await fetch(API_CONFIG.baseUrl, {
                headers: API_CONFIG.headers
            });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const funcionarios = await response.json();
            appState.funcionarios = funcionarios;
            appState.funcionariosFiltrados = [...funcionarios];
            
            // Aplica filtros se existirem
            if (appState.filtros.nome || appState.filtros.setor) {
                FilterManager.aplicarFiltros();
            } else {
                this.renderizarTabela(funcionarios);
            }
            
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            elements.tabelaFuncionarios.innerHTML = `
                <tr>
                    <td colspan="6" class="loading" style="color: #ff6384;">
                        Erro ao carregar dados. Verifique se o back-end está rodando.
                    </td>
                </tr>
            `;
        } finally {
            appState.isLoading = false;
        }
    },

    renderizarTabela(funcionarios) {
        if (!funcionarios || funcionarios.length === 0) {
            elements.tabelaFuncionarios.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">
                        ${appState.filtros.nome || appState.filtros.setor ? 
                          'Nenhum funcionário encontrado com os filtros aplicados.' : 
                          'Nenhum funcionário cadastrado ainda.'}
                    </td>
                </tr>
            `;
            return;
        }

        const rows = funcionarios.map(funcionario => `
            <tr>
                <td>${funcionario.id}</td>
                <td>${funcionario.nome || 'N/A'}</td>
                <td>${funcionario.cargo || 'N/A'}</td>
                <td>${funcionario.setor || 'N/A'}</td>
                <td>${funcionario.email || 'N/A'}</td>
                <td class="actions-column">
                    <button 
                        class="btn btn-danger btn-sm" 
                        onclick="abrirModalExclusao(${funcionario.id})"
                        title="Excluir funcionário"
                    >
                        ⚡🗑️
                    </button>
                </td>
            </tr>
        `).join('');

        elements.tabelaFuncionarios.innerHTML = rows;
    }
};

// Gerenciador de Formulários
const FormManager = {
    init() {
        // Máscaras de input
        this.setupInputMasks();
        
        // Validação em tempo real
        this.setupRealTimeValidation();
        
        // Submit do formulário
        elements.formCadastro.addEventListener('submit', this.handleSubmit.bind(this));
    },

    setupInputMasks() {
        const cpfInput = document.getElementById('cpf');
        const telefoneInput = document.getElementById('telefone');

        cpfInput.addEventListener('input', (e) => {
            e.target.value = Utils.formatCPF(e.target.value);
        });

        telefoneInput.addEventListener('input', (e) => {
            e.target.value = Utils.formatTelefone(e.target.value);
        });
    },

    setupRealTimeValidation() {
        const cpfInput = document.getElementById('cpf');
        const emailInput = document.getElementById('email');

        cpfInput.addEventListener('blur', (e) => {
            const cpf = e.target.value.replace(/\D/g, '');
            if (cpf && !Utils.validarCPF(cpf)) {
                e.target.setCustomValidity('CPF inválido');
            } else {
                e.target.setCustomValidity('');
            }
        });

        emailInput.addEventListener('blur', (e) => {
            if (e.target.value && !Utils.validarEmail(e.target.value)) {
                e.target.setCustomValidity('E-mail inválido');
            } else {
                e.target.setCustomValidity('');
            }
        });
    },

    async handleSubmit(event) {
        event.preventDefault();
        
        if (appState.isLoading) return;
        
        const formData = new FormData(elements.formCadastro);
        const funcionario = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            cpf: formData.get('cpf').replace(/\D/g, ''),
            telefone: formData.get('telefone').replace(/\D/g, ''),
            data_admissao: formData.get('data_admissao'),
            cargo: formData.get('cargo'),
            setor: formData.get('setor') || null, // Agora pega do select
            salario: formData.get('salario') ? parseFloat(formData.get('salario')) : null,
            endereco: formData.get('endereco') || null,
            foto: ''
        };

        // Validações adicionais
        if (!Utils.validarCPF(funcionario.cpf)) {
            AlertManager.show('CPF inválido. Verifique os dados informados.', 'danger');
            return;
        }

        if (!Utils.validarEmail(funcionario.email)) {
            AlertManager.show('E-mail inválido. Verifique os dados informados.', 'danger');
            return;
        }

        await this.cadastrarFuncionario(funcionario);
    },

    async cadastrarFuncionario(funcionario) {
        try {
            const response = await fetch(API_CONFIG.baseUrl, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify(funcionario)
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            AlertManager.show('Funcionário cadastrado com sucesso!', 'success');
            this.reset();
            FuncionarioManager.carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            AlertManager.show('Erro ao cadastrar funcionário. Verifique os dados e tente novamente.', 'danger');
        }
    },

    reset() {
        elements.formCadastro.reset();
        // Limpar validações customizadas
        const inputs = elements.formCadastro.querySelectorAll('input');
        inputs.forEach(input => input.setCustomValidity(''));
    }
};

// Gerenciador de API
const APIManager = {
    async request(url, options = {}) {
        try {
            appState.isLoading = true;
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...API_CONFIG.headers,
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return options.method === 'DELETE' ? null : await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        } finally {
            appState.isLoading = false;
        }
    },

    async listarFuncionarios() {
        try {
            TableManager.showLoading();
            const funcionarios = await this.request(API_CONFIG.baseUrl);
            appState.funcionarios = funcionarios;
            TableManager.render(funcionarios);
        } catch (error) {
            console.error('Erro ao listar funcionários:', error);
            TableManager.showError('Erro ao carregar dados. Verifique se o back-end está rodando.');
        }
    },

    async cadastrarFuncionario(funcionario) {
        try {
            await this.request(API_CONFIG.baseUrl, {
                method: 'POST',
                body: JSON.stringify(funcionario)
            });
            
            AlertManager.show('Funcionário cadastrado com sucesso!', 'success');
            FormManager.reset();
            await this.listarFuncionarios();
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            AlertManager.show('Erro ao cadastrar funcionário. Verifique os dados e tente novamente.', 'danger');
        }
    },

    async excluirFuncionario(id) {
        try {
            await this.request(`${API_CONFIG.baseUrl}/${id}`, {
                method: 'DELETE'
            });
            
            AlertManager.show('Funcionário excluído com sucesso!', 'success');
            await this.listarFuncionarios();
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            AlertManager.show('Erro ao excluir funcionário. Tente novamente.', 'danger');
        }
    }
};

// Gerenciador de Tabela
const TableManager = {
    render(funcionarios) {
        if (!funcionarios || funcionarios.length === 0) {
            elements.tabelaFuncionarios.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">Nenhum funcionário cadastrado.</td>
                </tr>
            `;
            return;
        }

        const rows = funcionarios.map(funcionario => `
            <tr>
                <td>${funcionario.id}</td>
                <td>${funcionario.nome || 'N/A'}</td>
                <td>${funcionario.cargo || 'N/A'}</td>
                <td>${funcionario.setor || 'N/A'}</td>
                <td>${funcionario.email || 'N/A'}</td>
                <td class="actions-column">
                    <button 
                        class="btn btn-danger btn-sm" 
                        onclick="abrirModalExclusao(${funcionario.id})"
                        title="Excluir funcionário"
                    >
                        ⚡🗑️
                    </button>
                </td>
            </tr>
        `).join('');

        elements.tabelaFuncionarios.innerHTML = rows;
    },

    showLoading() {
        elements.tabelaFuncionarios.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    <span class="loading-spinner"></span>
                    Carregando...
                </td>
            </tr>
        `;
    },

    showError(message) {
        elements.tabelaFuncionarios.innerHTML = `
            <tr>
                <td colspan="6" class="loading" style="color: #dc3545;">
                    ${message}
                </td>
            </tr>
        `;
    }
};

// Funções globais (para compatibilidade com onclick)
window.abrirModalExclusao = function(id) {
    appState.idParaExcluir = id;
    ModalManager.show();
};

window.executarExclusao = async function() {
    if (!appState.idParaExcluir) return;
    
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/${appState.idParaExcluir}`, {
            method: 'DELETE',
            headers: API_CONFIG.headers
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        AlertManager.show('Funcionário excluído com sucesso!', 'success');
        FuncionarioManager.carregarFuncionarios();
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        AlertManager.show('Erro ao excluir funcionário. Tente novamente.', 'danger');
    }
    
    ModalManager.hide();
};

// Inicialização da aplicação
class App {
    static async init() {
        try {
            // Inicializar componentes
            NavigationManager.init();
            FilterManager.init();
            FormManager.init();
            ModalManager.init();
            
            // Event listener para confirmação de exclusão
            if (elements.confirmDeleteBtn) {
                elements.confirmDeleteBtn.addEventListener('click', window.executarExclusao);
            }
            
            console.log('Aplicação inicializada com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            AlertManager.show('Erro ao inicializar aplicação. Recarregue a página.', 'danger');
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', App.init);

// Tratamento de erros globais
window.addEventListener('error', (event) => {
    console.error('Erro global:', event.error);
    AlertManager.show('Ocorreu um erro inesperado. Tente recarregar a página.', 'danger');
});

// Tratamento de promessas rejeitadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejeitada:', event.reason);
    AlertManager.show('Erro de conexão. Verifique sua internet e tente novamente.', 'danger');
});

