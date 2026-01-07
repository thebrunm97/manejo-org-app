# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Não lançado]

### Adicionado
- Criação do arquivo CHANGELOG.md para rastreamento de mudanças.

## [v0.13.1] - 2026-01-06

### ✨ Melhorias de UX/UI (Mobile First)
- **Diário de Campo (`DiarioDeCampo.jsx`)**: Refatorado para layout responsivo. Desktop exibe tabela fluida; Mobile exibe cards estilo "Feed" (Instagram-style).
- **Dashboard de Colheita (`HarvestDashboard.jsx`)**: Aplicado mesmo padrão responsivo (Tabela/Cards) na seção "Últimos Registros".
- **Tabelas Gerais (`GeneralLogTable.jsx`)**: Padronização dos componentes de listagem.

### 🗺️ Mapa
- **Layout Mobile Otimizado**: Altura do mapa ajustada para `40vh` no mobile, permitindo visibilidade da lista de talhões.
- **Interação Melhorada**: Removida a "trava de scroll" (Map Lock). O mapa agora é sempre interativo e a rolagem da página é feita pela área da lista.

### 🐛 Correções
- **Scroll Infinito (`DashboardLayout.jsx`)**: Corrigido bug crítico que impedia a rolagem da página. Layout reestruturado com Flexbox e `height: 100dvh`.

### 🆕 Novas Funcionalidades
- **Página "Minhas Culturas"**: Adicionada rota `/culturas` com placeholder visual ("Em Breve").

## [v0.13] - 2026-01-06

### Contexto
- Versão atual em desenvolvimento (baseado no diretório `manejo_ORG_v0.13`).
- Foco recente em correções de estabilidade (Error Boundaries, correções de .map indefinido) e refatoração de layout (DashboardLayout, responsividade).
