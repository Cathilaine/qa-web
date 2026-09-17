# QA Web — Navegação e artigos do blog do Agi

Automação end-to-end (Playwright + JavaScript), em Page Object Model, para fluxos de navegação e conteúdo do [blog do Agi](https://blog.agibank.com.br/)

## Cenários automatizados

1. **Navegar pelo menu até "Notícias"** — clica no link "Notícias" do menu principal e valida a URL, o título `Notícias` (h1) e que a listagem traz pelo menos um artigo.

2. **Abrir o primeiro artigo em destaque da home** — clica no título do primeiro artigo de "Artigos recentes" e valida que a página do artigo exibe o mesmo título (h1) e o indicador `Publicado em:`.

3. **Ir para a página 2 da listagem de artigos** — navega para `/page/2/` a partir da paginação da home e valida que o primeiro artigo listado é diferente do da página 1.

4. **Redirecionamento ao clicar em "Ir para o site"** — clica no link "Ir para o site" da home e valida que o usuário é redirecionado para o site institucional do Agibank (`https://agibank.com.br/`), verificando a URL, o título da página e a exibição do heading do site.

5. **Buscar por um termo com artigos correspondentes** — navega para a URL de busca (`/?s=investimentos`) e valida que o heading exibe o termo buscado e que ao menos um artigo é retornado.

6. **Buscar por um termo sem artigos correspondentes** — navega para a URL de busca com um termo inexistente e valida que nenhum artigo é retornado e que a mensagem de ausência de resultados é exibida.

### Sobre a busca pela lupa (bug conhecido)

O clique no ícone de busca (`Search icon link`) da home está **quebrado em produção**: ele não abre o campo de busca. A causa raiz é um erro JavaScript (`$scope.imagesLoaded is not a function`) disparado pela otimização de "delayed JS" do plugin LiteSpeed Cache em uma visita sem cache aquecido — o script responsável por ligar o clique do ícone à exibição do formulário nunca é executado. Isso foi confirmado inspecionando o DOM e o console do navegador (nenhuma classe ou estilo muda após o clique, mesmo disparando o evento nativamente). BUG real do site!

Como a busca do WordPress funciona via URL (`?s=termo`) independente do ícone quebrado, os cenários 5 e 6 acima foram automatizados navegando direto para essa URL — o que valida a funcionalidade de busca em si, isolada do bug de UI.

## Stack

- [Playwright Test](https://playwright.dev/) (JavaScript)
- Node.js 18+

## Configuração do ambiente

```bash
git clone <url-do-repositorio>
cd qa-web-agi-blog
npm install
npx playwright install --with-deps chromium
```

## Executando os testes

```bash
npm test
npm run test:headed
npm run test:ui
```

## Lint e formatação

O projeto usa [ESLint](https://eslint.org/) (com [eslint-plugin-playwright](https://github.com/playwright-community/eslint-plugin-playwright)) e [Prettier](https://prettier.io/) para manter o código e a indentação padronizados:

```bash
npm run lint          # analisa o código
npm run lint:fix      # analisa e corrige o que for auto-corrigível
npm run format        # formata todos os arquivos (indentação, aspas, etc.)
npm run format:check  # verifica se está tudo formatado, sem alterar arquivos
```

## Relatório

Após a execução, um relatório HTML é gerado automaticamente:

```bash
npm run report
```

## CI

O workflow em `.github/workflows/playwright.yml` roda a suíte completa a cada push/PR para `main` (e também pode ser disparado manualmente), e publica o relatório HTML como artefato do job.

## Estrutura do projeto

```
qa-web-agi-blog/
├── .github/workflows/playwright.yml
├── core/
│   ├── locators/
│   │   ├── homeLocators.js        # seletores da home (menu, cards de artigo, paginação)
│   │   ├── articleLocators.js     # seletores/textos da página de artigo
│   │   ├── siteLocators.js        # seletores do site institucional do Agibank
│   │   └── searchLocators.js      # seletores da página de resultados de busca
│   ├── pages/
│   │   ├── homePage.js             # ações da home (menu, abrir artigo, paginação)
│   │   ├── articlePage.js          # asserções da página de artigo
│   │   ├── sitePage.js             # asserções do site institucional do Agibank
│   │   └── searchPage.js           # ações/asserções da página de resultados de busca
│   └── tests/
│       ├── navegacaoArtigos.spec.js   # cenários 1 a 4
│       └── buscaArtigos.spec.js       # cenários 5 e 6 (busca)
├── eslint.config.js
├── .prettierrc.json
├── playwright.config.js
└── package.json
```

---

## Padrão Page Object

- Locators: core/locators/modulo.js → exporta função que retorna objeto de locators
- Page: core/pages/modulo.js → construtor chama locators e armazena em this.locators
- Locators sempre semânticos (getByRole, getByLabel, getByText)

## Considerações

- Os testes fixam o viewport em 1280x800 no `playwright.config.js` para garantir a versão desktop do layout e evitar ambiguidade de seletor entre menu mobile e desktop.
- A validação do artigo usa o indicador `Publicado em:` (presente em todo artigo) e o `h1` da página, em vez de conteúdo específico do texto, paranão quebrar quando o conteúdo do blog mudar.
