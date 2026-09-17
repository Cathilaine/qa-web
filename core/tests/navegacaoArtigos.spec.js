import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { ArticlePage } from '../pages/articlePage';
import { SitePage } from '../pages/sitePage';

test.describe('Navegação e artigos do blog do Agi', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('Validar navegação pelo menu Notícias', async ({ page }) => {
    await test.step('Dado que o usuário está na home do blog', async () => {
      await expect(page).toHaveURL(/\/$/);
    });

    await test.step('Quando navega pelo menu até "Notícias"', async () => {
      await homePage.irParaNoticias();
    });

    await test.step('Então a página de Notícias é exibida com pelo menos um artigo', async () => {
      await expect(page).toHaveURL(/\/noticias\/?$/);
      await expect(homePage.noticiasHeading).toBeVisible();
      expect(await homePage.artigos.count()).toBeGreaterThan(0);
    });
  });

  test('Validar paginação da listagem do menu Notícias', async ({ page }) => {
    await test.step('Dado que o usuário está na home do blog e vai ate menu Notícias', async () => {
      await expect(page).toHaveURL(/\/$/);
    });

    await test.step('Quando navega alternando entre as páginas', async () => {
      await homePage.irParaPagina(2);
      await expect(page).toHaveURL(/\/page\/2\/?$/);
      await homePage.irParaUltimaPagina();
      await expect(page).toHaveURL(/\/page\/\d+\/?$/);
    });

    await test.step('E retorna para pagina de Noticias', async () => {
      await homePage.irParaPrimeiraPagina();
    });

    await test.step('Então a primeira página é exibida novamente sem erros', async () => {
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test('Validar abertura de artigo em destaque e o conteúdo', async ({ page }) => {
    let tituloEsperado;
    let articlePage;

    await test.step('Dado que o usuário está na home com artigos em destaque', async () => {
      tituloEsperado = (await homePage.primeiroTituloArtigo.textContent()).trim();
    });

    await test.step('Quando abre o primeiro artigo em destaque', async () => {
      await homePage.abrirPrimeiroArtigo();
      articlePage = new ArticlePage(page);
    });

    await test.step('Então a página do artigo exibe o mesmo título e o indicador "Publicado em:"', async () => {
      await expect(articlePage.heading).toHaveText(tituloEsperado);
      await expect(articlePage.publicadoEm).toBeVisible();
    });
  });

  test('Validar redirecionamento ao clicar em "Ir para o site" para o site institucional do Agibank', async ({
    page,
  }) => {
    let sitePage;

    await test.step('Dado que o usuário está na home do blog', async () => {
      await expect(page).toHaveURL(/\/$/);
    });

    await test.step('Quando clica em "Ir para o site"', async () => {
      await homePage.irParaSite();
      sitePage = new SitePage(page);
    });

    await test.step('Então o site institucional do Agibank é exibido', async () => {
      await expect(page).toHaveURL(/^https:\/\/agibank\.com\.br\//);
      await expect(page).toHaveTitle(/Agibank/);
      await expect(sitePage.heading).toBeVisible();
    });
  });
});
