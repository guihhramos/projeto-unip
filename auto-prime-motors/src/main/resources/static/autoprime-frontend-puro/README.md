# Sistema de Cadastro de Funcionários - AutoPrime Motors

## Descrição
Frontend desenvolvido em HTML, CSS e JavaScript puro para o Sistema de Cadastro de Funcionários (SCF) da AutoPrime Motors. Esta aplicação apresenta um **design futurista** com paleta de cores azul/roxo/ciano e permite cadastrar, listar e excluir funcionários através de uma interface moderna e altamente responsiva.

## ✨ Novidades da Versão 4.0 - Conexão Corrigida
- **🎨 Nova Paleta de Cores**: Azul escuro, roxo vibrante e ciano elétrico (menos verde!)
- **🔧 Conexão Backend Corrigida**: Requisições HTTP ajustadas para funcionar com o backend Spring Boot
- **🌟 Glassmorphism Aprimorado**: Efeitos de vidro fosco com a nova paleta
- **⚡ Animações Refinadas**: Transições suaves com cores azul/roxo/ciano
- **🔧 Dropdown de Setores**: Campo de seleção com 9 opções predefinidas
- **🎯 Tipografia Moderna**: Fonte Roboto Mono para visual tecnológico
- **🆕 Menu de Navegação**: Sistema de abas para alternar entre cadastro e listagem
- **🔍 Busca em Tempo Real**: Campo de pesquisa por nome com filtragem instantânea
- **🏢 Filtro por Setor**: Dropdown para filtrar funcionários por setor específico
- **🔄 Limpar Filtros**: Botão para resetar todos os filtros aplicados

## Tecnologias Utilizadas
- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilização futurista com gradientes, backdrop-filter e animações
- **JavaScript ES6+**: Funcionalidades interativas e comunicação com API
- **Google Fonts**: Roboto Mono para tipografia moderna

## Funcionalidades
- ✅ **NOVO**: Menu de navegação com abas "Cadastrar" e "Listar Funcionários"
- ✅ Cadastro de funcionários com validação de dados
- ✅ **NOVO**: Dropdown de setores com 9 opções predefinidas
- ✅ **NOVO**: Busca em tempo real por nome do funcionário
- ✅ **NOVO**: Filtro por setor com dropdown interativo
- ✅ **NOVO**: Botão "Limpar Filtros" para resetar busca e filtros
- ✅ Listagem de funcionários em tabela responsiva futurista
- ✅ Exclusão de funcionários com modal de confirmação estilizado
- ✅ Máscaras automáticas para CPF e telefone
- ✅ Validação de CPF e e-mail em tempo real
- ✅ Alertas de sucesso e erro com design futurista
- ✅ **NOVO**: Design responsivo com efeitos glassmorphism
- ✅ **NOVO**: Animações e transições avançadas

## Estrutura do Projeto
```
autoprime-frontend-puro/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos futuristas da aplicação
├── js/
│   └── app.js          # Lógica da aplicação
└── README.md           # Documentação
```

## Campos do Formulário
- **Nome Completo** (obrigatório)
- **E-mail** (obrigatório, com validação)
- **CPF** (obrigatório, com máscara e validação)
- **Telefone** (opcional, com máscara)
- **Data de Admissão** (obrigatório)
- **Cargo** (obrigatório)
- **🆕 Setor** (dropdown com opções):
  - Tecnologia
  - Recursos Humanos (RH)
  - Vendas
  - Marketing
  - Financeiro
  - Logística
  - Manutenção
  - Diretoria
  - Outro
- **Salário** (opcional)
- **Endereço** (opcional)

## 🎨 Paleta de Cores Futurista
- **Fundo Principal**: `#022c22` (Verde escuro)
- **Cor de Destaque**: `#16c19b` (Ciano vibrante)
- **Cor Secundária**: `#1a8a71` (Verde médio)
- **Texto Principal**: `#f0f8ff` (Alice Blue)
- **Texto Secundário**: `#a0b0c0` (Cinza azulado)

## API Backend
A aplicação se comunica com uma API REST em:
- **URL Base**: `http://localhost:8081/api/funcionarios`
- **Métodos**: GET (listar), POST (cadastrar), DELETE (excluir)

## Como Usar
1. Abra o arquivo `index.html` em um navegador web
2. Certifique-se de que o backend está rodando na porta 8081
3. **NOVO**: Use as abas do menu para navegar entre "Cadastrar Funcionário" e "Listar Funcionários"
4. **Aba Cadastrar**: Preencha o formulário e selecione um setor no dropdown
5. Clique em "⚡ Cadastrar Funcionário"
6. **Aba Listar**: Os funcionários aparecerão na tabela
7. **NOVO**: Use o campo "🔍 Pesquisar por Nome" para buscar funcionários específicos
8. **NOVO**: Use o dropdown "🏢 Filtrar por Setor" para filtrar por setor
9. **NOVO**: Clique em "🔄 Limpar Filtros" para remover todos os filtros
10. Use o botão "⚡🗑️" para excluir funcionários

## 🚀 Recursos de Design Futurista
- **Nova Paleta Azul/Roxo/Ciano**: Cores menos verdes, mais futuristas
- **Menu de Navegação Futurista**: Abas com efeitos de brilho ciano e transições suaves
- **Campos de Busca Estilizados**: Inputs com bordas neon ciano e efeitos de foco
- **Glassmorphism Aprimorado**: Efeitos de vidro fosco com backdrop-filter
- **Gradientes Animados**: Cores azul/roxo que se movem e brilham
- **Partículas de Fundo**: Efeitos sutis de movimento em tons azul/roxo
- **Bordas Neon Ciano**: Animações de brilho nas bordas dos elementos
- **Tipografia Sci-Fi**: Fonte monoespaçada Roboto Mono
- **Hover Effects**: Transformações 3D e brilhos ao passar o mouse
- **Scrollbar Personalizada**: Estilizada com a nova paleta de cores
- **Filtros Interativos**: Busca em tempo real com feedback visual

## Validações Implementadas
- CPF com algoritmo de validação oficial
- E-mail com regex pattern
- Campos obrigatórios marcados com asterisco
- Feedback visual para campos válidos/inválidos
- Validação em tempo real

## Compatibilidade
- Chrome 60+ ✅
- Firefox 55+ ✅
- Safari 12+ ✅
- Edge 79+ ✅
- Dispositivos móveis (iOS Safari, Chrome Mobile) ✅

## 🔮 Melhorias Futuras
- Edição de funcionários
- **Busca avançada** com múltiplos critérios
- **Ordenação** da tabela por colunas
- Paginação da tabela
- Upload de foto do funcionário
- **Exportação** de dados filtrados (PDF, Excel)
- Modo escuro/claro
- **Histórico** de alterações
- **Dashboard** com estatísticas
- Mais efeitos de partículas
- Integração com realidade aumentada

---
**🚀 Desenvolvido para AutoPrime Motors**  
*Frontend Futurista em HTML, CSS e JavaScript puro - Design Sci-Fi sem dependências externas*

**Versão**: 4.0 Conexão Corrigida + Design Azul/Roxo  
**Data**: Setembro 2025

