// Configuração da API
const API_CONFIG = {
    baseUrl: 'http://localhost:8081/api/funcionarios',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Estado da aplicação
let appState = {
    funcionarios: [],
    funcionariosFiltrados: [],
    idParaExcluir: null,
    isLoading: false,
    currentSection: 'dashboard',
    filtros: {
        nome: '',
        setor: ''
    },
    charts: {
        setorChart: null,
        salarioChart: null,
        reportSetorChart: null,
        reportSalarioChart: null
    }
};

// Elementos DOM
const elements = {
    // Navegação
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    pageTitle: document.getElementById('pageTitle'),
    
    // Seções
    sections: document.querySelectorAll('.content-section'),
    
    // Dashboard
    totalFuncionarios: document.getElementById('totalFuncionarios'),
    totalSetores: document.getElementById('totalSetores'),
    novasContratacoes: document.getElementById('novasContratacoes'),
    mediaSalarial: document.getElementById('mediaSalarial'),
    activityList: document.getElementById('activityList'),
    
    // Formulário
    formCadastro: document.getElementById('formCadastro'),
    btnLimparForm: document.getElementById('btnLimparForm'),
    
    // Tabela
    tabelaFuncionarios: document.getElementById('tabelaFuncionarios'),
    searchNome: document.getElementById('searchNome'),
    filterSetor: document.getElementById('filterSetor'),
    btnLimparFiltros: document.getElementById('btnLimparFiltros'),
    
    // Modal
    confirmDeleteModal: document.getElementById('confirmDeleteModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    
    // Backup
    btnExportarDados: document.getElementById('btnExportarDados'),
    fileImportarDados: document.getElementById('fileImportarDados'),
    btnLimparDados: document.getElementById('btnLimparDados'),
    
    // Alertas
    alertArea: document.getElementById('alertArea')
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
    },

    // Calcular dias desde a data
    diasDesde(data) {
        if (!data) return 0;
        const hoje = new Date();
        const dataAdmissao = new Date(data);
        const diffTime = hoje - dataAdmissao;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};

// Gerenciador de Navegação
const NavigationManager = {
    init() {
        this.bindEvents();
        this.showSection('dashboard');
    },

    bindEvents() {
        // Menu lateral
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Toggle sidebar
        if (elements.sidebarToggle) {
            elements.sidebarToggle.addEventListener('click', this.toggleSidebar);
        }

        if (elements.mobileMenuToggle) {
            elements.mobileMenuToggle.addEventListener('click', this.toggleSidebar);
        }

        // Fechar sidebar ao clicar fora (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!elements.sidebar.contains(e.target) && 
                    !elements.mobileMenuToggle.contains(e.target)) {
                    elements.sidebar.classList.remove('open');
                }
            }
        });
    },

    showSection(sectionName) {
        // Atualizar estado
        appState.currentSection = sectionName;

        // Remover classe active de todas as seções
        elements.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remover classe active de todos os links
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Ativar seção e link correspondente
        const targetSection = document.getElementById(`${sectionName}Section`);
        const targetLink = document.querySelector(`[data-section="${sectionName}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
        }

        if (targetLink) {
            targetLink.classList.add('active');
        }

        // Atualizar título da página
        const titles = {
            dashboard: 'Dashboard',
            cadastro: 'Cadastrar Funcionário',
            funcionarios: 'Funcionários',
            relatorios: 'Relatórios',
            backup: 'Backup e Dados',
            configuracoes: 'Configurações'
        };

        elements.pageTitle.textContent = titles[sectionName] || 'Sistema';

        // Carregar dados específicos da seção
        this.loadSectionData(sectionName);

        // Fechar sidebar em mobile
        if (window.innerWidth <= 1024) {
            elements.sidebar.classList.remove('open');
        }
    },

    toggleSidebar() {
        elements.sidebar.classList.toggle('open');
    },

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                await DashboardManager.loadData();
                break;
            case 'funcionarios':
                await FuncionarioManager.carregarFuncionarios();
                break;
            case 'relatorios':
                await ReportManager.loadReports();
                break;
        }
    }
};

// Gerenciador de Dashboard
const DashboardManager = {
    async loadData() {
        try {
            await FuncionarioManager.carregarFuncionarios();
            this.updateStats();
            this.createCharts();
            this.loadRecentActivities();
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        }
    },

    updateStats() {
        const funcionarios = appState.funcionarios;
        
        // Total de funcionários
        elements.totalFuncionarios.textContent = funcionarios.length;

        // Total de setores únicos
        const setores = [...new Set(funcionarios.map(f => f.setor).filter(Boolean))];
        elements.totalSetores.textContent = setores.length;

        // Contratações nos últimos 30 dias
        const hoje = new Date();
        const trintaDiasAtras = new Date(hoje.getTime() - (30 * 24 * 60 * 60 * 1000));
        const novasContratacoes = funcionarios.filter(f => {
            if (!f.data_admissao) return false;
            const dataAdmissao = new Date(f.data_admissao);
            return dataAdmissao >= trintaDiasAtras;
        });
        elements.novasContratacoes.textContent = novasContratacoes.length;

        // Média salarial
        const salariosValidos = funcionarios.filter(f => f.salario && f.salario > 0);
        const mediaSalarial = salariosValidos.length > 0 
            ? salariosValidos.reduce((sum, f) => sum + f.salario, 0) / salariosValidos.length
            : 0;
        elements.mediaSalarial.textContent = Utils.formatarSalario(mediaSalarial);
    },

    createCharts() {
        this.createSetorChart();
        this.createSalarioChart();
    },

    createSetorChart() {
        const ctx = document.getElementById('setorChart');
        if (!ctx) return;

        // Destruir chart existente
        if (appState.charts.setorChart) {
            appState.charts.setorChart.destroy();
        }

        const funcionarios = appState.funcionarios;
        const setorCount = {};
        
        funcionarios.forEach(f => {
            const setor = f.setor || 'Não informado';
            setorCount[setor] = (setorCount[setor] || 0) + 1;
        });

        const labels = Object.keys(setorCount);
        const data = Object.values(setorCount);
        const colors = [
            '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', 
            '#FF9800', '#FF5722', '#9C27B0', '#3F51B5', '#2196F3'
        ];

        appState.charts.setorChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    },

    createSalarioChart() {
        const ctx = document.getElementById('salarioChart');
        if (!ctx) return;

        // Destruir chart existente
        if (appState.charts.salarioChart) {
            appState.charts.salarioChart.destroy();
        }

        const funcionarios = appState.funcionarios.filter(f => f.salario && f.salario > 0);
        
        // Agrupar por faixas salariais
        const faixas = {
            'Até R$ 2.000': 0,
            'R$ 2.001 - R$ 4.000': 0,
            'R$ 4.001 - R$ 6.000': 0,
            'R$ 6.001 - R$ 8.000': 0,
            'Acima de R$ 8.000': 0
        };

        funcionarios.forEach(f => {
            const salario = f.salario;
            if (salario <= 2000) faixas['Até R$ 2.000']++;
            else if (salario <= 4000) faixas['R$ 2.001 - R$ 4.000']++;
            else if (salario <= 6000) faixas['R$ 4.001 - R$ 6.000']++;
            else if (salario <= 8000) faixas['R$ 6.001 - R$ 8.000']++;
            else faixas['Acima de R$ 8.000']++;
        });

        appState.charts.salarioChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(faixas),
                datasets: [{
                    label: 'Funcionários',
                    data: Object.values(faixas),
                    backgroundColor: '#4CAF50',
                    borderColor: '#45A049',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    loadRecentActivities() {
        const activities = [
            {
                icon: 'fas fa-user-plus',
                title: 'Novo funcionário cadastrado',
                time: '2 horas atrás'
            },
            {
                icon: 'fas fa-edit',
                title: 'Dados atualizados no sistema',
                time: '4 horas atrás'
            },
            {
                icon: 'fas fa-chart-bar',
                title: 'Relatório mensal gerado',
                time: '1 dia atrás'
            },
            {
                icon: 'fas fa-users',
                title: 'Backup dos dados realizado',
                time: '2 dias atrás'
            }
        ];

        const activityHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');

        elements.activityList.innerHTML = activityHTML;
    }
};

// Gerenciador de Funcionários
const FuncionarioManager = {
    async carregarFuncionarios() {
        try {
            appState.isLoading = true;
            this.showLoading();
            
            const response = await fetch(API_CONFIG.baseUrl, {
                headers: API_CONFIG.headers
            });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const funcionarios = await response.json();
            appState.funcionarios = funcionarios;
            appState.funcionariosFiltrados = [...funcionarios];
            
            // Aplicar filtros se existirem
            if (appState.filtros.nome || appState.filtros.setor) {
                FilterManager.aplicarFiltros();
            } else {
                this.renderizarTabela(funcionarios);
            }
            
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            this.showError('Erro ao carregar dados. Verifique se o back-end está rodando.');
        } finally {
            appState.isLoading = false;
        }
    },

    renderizarTabela(funcionarios) {
        if (!funcionarios || funcionarios.length === 0) {
            elements.tabelaFuncionarios.innerHTML = `
                <tr>
                    <td colspan="7" class="loading">
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
                <td>${funcionario.nome}</td>
                <td>${funcionario.cargo || 'N/A'}</td>
                <td>${funcionario.setor || 'N/A'}</td>
                <td>${funcionario.email}</td>
                <td>${Utils.formatarData(funcionario.data_admissao)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="FuncionarioManager.editarFuncionario(${funcionario.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="FuncionarioManager.confirmarExclusao(${funcionario.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        elements.tabelaFuncionarios.innerHTML = rows;
    },

    showLoading() {
        if (elements.tabelaFuncionarios) {
            elements.tabelaFuncionarios.innerHTML = `
                <tr>
                    <td colspan="7" class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        Carregando funcionários...
                    </td>
                </tr>
            `;
        }
    },

    showError(message) {
        if (elements.tabelaFuncionarios) {
            elements.tabelaFuncionarios.innerHTML = `
                <tr>
                    <td colspan="7" class="loading">
                        <i class="fas fa-exclamation-triangle"></i>
                        ${message}
                    </td>
                </tr>
            `;
        }
    },

    async cadastrarFuncionario(dadosFuncionario) {
        try {
            const response = await fetch(API_CONFIG.baseUrl, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify(dadosFuncionario)
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const funcionario = await response.json();
            AlertManager.showSuccess('Funcionário cadastrado com sucesso!');
            
            // Recarregar dados
            await this.carregarFuncionarios();
            
            // Limpar formulário
            FormManager.limparFormulario();
            
            return funcionario;
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            AlertManager.showError('Erro ao cadastrar funcionário. Tente novamente.');
            throw error;
        }
    },

    async excluirFuncionario(id) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: API_CONFIG.headers
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            AlertManager.showSuccess('Funcionário excluído com sucesso!');
            
            // Recarregar dados
            await this.carregarFuncionarios();
            
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            AlertManager.showError('Erro ao excluir funcionário. Tente novamente.');
            throw error;
        }
    },

    editarFuncionario(id) {
        const funcionario = appState.funcionarios.find(f => f.id === id);
        if (funcionario) {
            FormManager.preencherFormulario(funcionario);
            NavigationManager.showSection('cadastro');
        }
    },

    confirmarExclusao(id) {
        appState.idParaExcluir = id;
        ModalManager.showModal();
    }
};

// Gerenciador de Formulário
const FormManager = {
    init() {
        this.bindEvents();
        this.setupMasks();
    },

    bindEvents() {
        if (elements.formCadastro) {
            elements.formCadastro.addEventListener('submit', this.handleSubmit.bind(this));
        }

        if (elements.btnLimparForm) {
            elements.btnLimparForm.addEventListener('click', this.limparFormulario);
        }
    },

    setupMasks() {
        // Máscara para CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                e.target.value = Utils.formatCPF(e.target.value);
            });
        }

        // Máscara para telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                e.target.value = Utils.formatTelefone(e.target.value);
            });
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const dadosFuncionario = {};
        
        for (let [key, value] of formData.entries()) {
            dadosFuncionario[key] = value.trim();
        }

        // Validações
        if (!this.validarFormulario(dadosFuncionario)) {
            return;
        }

        // Converter salário para número
        if (dadosFuncionario.salario) {
            dadosFuncionario.salario = parseFloat(dadosFuncionario.salario);
        }

        try {
            await FuncionarioManager.cadastrarFuncionario(dadosFuncionario);
        } catch (error) {
            // Erro já tratado no FuncionarioManager
        }
    },

    validarFormulario(dados) {
        // Validar campos obrigatórios
        if (!dados.nome) {
            AlertManager.showError('Nome é obrigatório.');
            return false;
        }

        if (!dados.email) {
            AlertManager.showError('E-mail é obrigatório.');
            return false;
        }

        if (!Utils.validarEmail(dados.email)) {
            AlertManager.showError('E-mail inválido.');
            return false;
        }

        if (!dados.cpf) {
            AlertManager.showError('CPF é obrigatório.');
            return false;
        }

        if (!Utils.validarCPF(dados.cpf)) {
            AlertManager.showError('CPF inválido.');
            return false;
        }

        if (!dados.data_admissao) {
            AlertManager.showError('Data de admissão é obrigatória.');
            return false;
        }

        if (!dados.cargo) {
            AlertManager.showError('Cargo é obrigatório.');
            return false;
        }

        return true;
    },

    preencherFormulario(funcionario) {
        document.getElementById('nome').value = funcionario.nome || '';
        document.getElementById('email').value = funcionario.email || '';
        document.getElementById('cpf').value = funcionario.cpf || '';
        document.getElementById('telefone').value = funcionario.telefone || '';
        document.getElementById('data_admissao').value = funcionario.data_admissao || '';
        document.getElementById('cargo').value = funcionario.cargo || '';
        document.getElementById('setor').value = funcionario.setor || '';
        document.getElementById('salario').value = funcionario.salario || '';
        document.getElementById('endereco').value = funcionario.endereco || '';
    },

    limparFormulario() {
        if (elements.formCadastro) {
            elements.formCadastro.reset();
        }
    }
};

// Gerenciador de Filtros
const FilterManager = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        if (elements.searchNome) {
            elements.searchNome.addEventListener('input', this.handleSearch.bind(this));
        }

        if (elements.filterSetor) {
            elements.filterSetor.addEventListener('change', this.handleFilter.bind(this));
        }

        if (elements.btnLimparFiltros) {
            elements.btnLimparFiltros.addEventListener('click', this.limparFiltros.bind(this));
        }
    },

    handleSearch(e) {
        appState.filtros.nome = e.target.value.toLowerCase();
        this.aplicarFiltros();
    },

    handleFilter(e) {
        appState.filtros.setor = e.target.value;
        this.aplicarFiltros();
    },

    aplicarFiltros() {
        let funcionariosFiltrados = [...appState.funcionarios];

        // Filtro por nome
        if (appState.filtros.nome) {
            funcionariosFiltrados = funcionariosFiltrados.filter(f => 
                f.nome.toLowerCase().includes(appState.filtros.nome)
            );
        }

        // Filtro por setor
        if (appState.filtros.setor) {
            funcionariosFiltrados = funcionariosFiltrados.filter(f => 
                f.setor === appState.filtros.setor
            );
        }

        appState.funcionariosFiltrados = funcionariosFiltrados;
        FuncionarioManager.renderizarTabela(funcionariosFiltrados);
    },

    limparFiltros() {
        appState.filtros.nome = '';
        appState.filtros.setor = '';
        
        if (elements.searchNome) elements.searchNome.value = '';
        if (elements.filterSetor) elements.filterSetor.value = '';
        
        appState.funcionariosFiltrados = [...appState.funcionarios];
        FuncionarioManager.renderizarTabela(appState.funcionarios);
    }
};

// Gerenciador de Modal
const ModalManager = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        if (elements.modalCloseBtn) {
            elements.modalCloseBtn.addEventListener('click', this.hideModal);
        }

        if (elements.cancelDeleteBtn) {
            elements.cancelDeleteBtn.addEventListener('click', this.hideModal);
        }

        if (elements.confirmDeleteBtn) {
            elements.confirmDeleteBtn.addEventListener('click', this.handleConfirmDelete.bind(this));
        }

        if (elements.modalOverlay) {
            elements.modalOverlay.addEventListener('click', (e) => {
                if (e.target === elements.modalOverlay) {
                    this.hideModal();
                }
            });
        }
    },

    showModal() {
        if (elements.modalOverlay) {
            elements.modalOverlay.classList.add('active');
        }
    },

    hideModal() {
        if (elements.modalOverlay) {
            elements.modalOverlay.classList.remove('active');
        }
        appState.idParaExcluir = null;
    },

    async handleConfirmDelete() {
        if (appState.idParaExcluir) {
            try {
                await FuncionarioManager.excluirFuncionario(appState.idParaExcluir);
                this.hideModal();
            } catch (error) {
                // Erro já tratado no FuncionarioManager
            }
        }
    }
};

// Gerenciador de Alertas
const AlertManager = {
    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            ${message}
        `;

        elements.alertArea.appendChild(alert);

        // Remover após 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    },

    showSuccess(message) {
        this.showAlert(message, 'success');
    },

    showError(message) {
        this.showAlert(message, 'error');
    },

    showWarning(message) {
        this.showAlert(message, 'warning');
    },

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
};

// Gerenciador de Relatórios
const ReportManager = {
    async loadReports() {
        try {
            await FuncionarioManager.carregarFuncionarios();
            this.createReportCharts();
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
        }
    },

    createReportCharts() {
        this.createReportSetorChart();
        this.createReportSalarioChart();
    },

    createReportSetorChart() {
        const ctx = document.getElementById('reportSetorChart');
        if (!ctx) return;

        // Destruir chart existente
        if (appState.charts.reportSetorChart) {
            appState.charts.reportSetorChart.destroy();
        }

        const funcionarios = appState.funcionarios;
        const setorCount = {};
        
        funcionarios.forEach(f => {
            const setor = f.setor || 'Não informado';
            setorCount[setor] = (setorCount[setor] || 0) + 1;
        });

        const labels = Object.keys(setorCount);
        const data = Object.values(setorCount);

        appState.charts.reportSetorChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', 
                        '#FF9800', '#FF5722', '#9C27B0', '#3F51B5', '#2196F3'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    },

    createReportSalarioChart() {
        const ctx = document.getElementById('reportSalarioChart');
        if (!ctx) return;

        // Destruir chart existente
        if (appState.charts.reportSalarioChart) {
            appState.charts.reportSalarioChart.destroy();
        }

        const funcionarios = appState.funcionarios.filter(f => f.salario && f.salario > 0);
        
        // Agrupar por faixas salariais mais detalhadas
        const faixas = {
            'Até R$ 1.500': 0,
            'R$ 1.501 - R$ 3.000': 0,
            'R$ 3.001 - R$ 4.500': 0,
            'R$ 4.501 - R$ 6.000': 0,
            'R$ 6.001 - R$ 8.000': 0,
            'Acima de R$ 8.000': 0
        };

        funcionarios.forEach(f => {
            const salario = f.salario;
            if (salario <= 1500) faixas['Até R$ 1.500']++;
            else if (salario <= 3000) faixas['R$ 1.501 - R$ 3.000']++;
            else if (salario <= 4500) faixas['R$ 3.001 - R$ 4.500']++;
            else if (salario <= 6000) faixas['R$ 4.501 - R$ 6.000']++;
            else if (salario <= 8000) faixas['R$ 6.001 - R$ 8.000']++;
            else faixas['Acima de R$ 8.000']++;
        });

        appState.charts.reportSalarioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(faixas),
                datasets: [{
                    label: 'Funcionários',
                    data: Object.values(faixas),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
};

// Gerenciador de Backup
const BackupManager = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        if (elements.btnExportarDados) {
            elements.btnExportarDados.addEventListener('click', this.exportarDados.bind(this));
        }

        if (elements.fileImportarDados) {
            elements.fileImportarDados.addEventListener('change', this.importarDados.bind(this));
        }

        if (elements.btnLimparDados) {
            elements.btnLimparDados.addEventListener('click', this.confirmarLimpeza.bind(this));
        }
    },

    async exportarDados() {
        try {
            // Carregar dados mais recentes
            await FuncionarioManager.carregarFuncionarios();
            
            const dados = {
                funcionarios: appState.funcionarios,
                exportadoEm: new Date().toISOString(),
                versao: '4.0',
                sistema: 'AutoPrime Motors'
            };

            const dataStr = JSON.stringify(dados, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `autoprime_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            AlertManager.showSuccess('Dados exportados com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            AlertManager.showError('Erro ao exportar dados. Tente novamente.');
        }
    },

    async importarDados(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const dados = JSON.parse(text);
            
            // Validar estrutura do arquivo
            if (!dados.funcionarios || !Array.isArray(dados.funcionarios)) {
                throw new Error('Arquivo de backup inválido');
            }

            // Confirmar importação
            if (!confirm(`Deseja importar ${dados.funcionarios.length} funcionários? Isso substituirá todos os dados atuais.`)) {
                return;
            }

            // Limpar dados atuais
            await this.limparTodosDados(false);

            // Importar cada funcionário
            let importados = 0;
            for (const funcionario of dados.funcionarios) {
                try {
                    // Remover ID para evitar conflitos
                    const { id, ...funcionarioSemId } = funcionario;
                    await FuncionarioManager.cadastrarFuncionario(funcionarioSemId);
                    importados++;
                } catch (error) {
                    console.warn('Erro ao importar funcionário:', funcionario.nome, error);
                }
            }

            AlertManager.showSuccess(`${importados} funcionários importados com sucesso!`);
            
            // Recarregar dados
            await FuncionarioManager.carregarFuncionarios();
            
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            AlertManager.showError('Erro ao importar dados. Verifique se o arquivo é válido.');
        } finally {
            // Limpar input
            event.target.value = '';
        }
    },

    confirmarLimpeza() {
        if (confirm('⚠️ ATENÇÃO: Esta ação irá excluir TODOS os funcionários do sistema. Esta operação é IRREVERSÍVEL. Deseja continuar?')) {
            if (confirm('Tem certeza absoluta? Todos os dados serão perdidos permanentemente.')) {
                this.limparTodosDados(true);
            }
        }
    },

    async limparTodosDados(mostrarAlerta = true) {
        try {
            // Carregar funcionários atuais
            await FuncionarioManager.carregarFuncionarios();
            
            // Excluir cada funcionário
            const funcionarios = [...appState.funcionarios];
            let excluidos = 0;
            
            for (const funcionario of funcionarios) {
                try {
                    await FuncionarioManager.excluirFuncionario(funcionario.id);
                    excluidos++;
                } catch (error) {
                    console.warn('Erro ao excluir funcionário:', funcionario.nome, error);
                }
            }

            if (mostrarAlerta) {
                AlertManager.showSuccess(`${excluidos} funcionários excluídos com sucesso!`);
            }
            
            // Recarregar dados
            await FuncionarioManager.carregarFuncionarios();
            
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            if (mostrarAlerta) {
                AlertManager.showError('Erro ao limpar dados. Tente novamente.');
            }
        }
    }
};

// Função global para mostrar seção (usada no HTML)
function showSection(sectionName) {
    NavigationManager.showSection(sectionName);
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    NavigationManager.init();
    FormManager.init();
    FilterManager.init();
    ModalManager.init();
    BackupManager.init();
    
    // Carregar dados iniciais
    FuncionarioManager.carregarFuncionarios();
});

