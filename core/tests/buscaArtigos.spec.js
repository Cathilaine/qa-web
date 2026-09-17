import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/searchPage';

test.describe('Busca de artigos do blog do Agi', () => {
  let searchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
  });

  test('Validar busca por um termo com artigos correspondentes', async ({ page }) => {
    const termo = 'investimentos';

    await test.step(`Quando busca pelo termo "${termo}"`, async () => {
      await searchPage.buscar(termo);
    });

    await test.step('Então a página exibe o termo buscado e ao menos um artigo correspondente', async () => {
      await expect(page).toHaveURL(new RegExp(`\\?s=${termo}`));
      await expect(searchPage.heading).toHaveText(new RegExp(termo, 'i'));
      expect(await searchPage.resultados.count()).toBeGreaterThan(0);
    });
  });

  test('Validar busca por um termo sem artigos correspondentes', async ({ page }) => {
    const termo = 'xyzasdkjhasdqweqweasd123';

    await test.step(`Quando busca por um termo inexistente "${termo}"`, async () => {
      await searchPage.buscar(termo);
    });

    await test.step('Então nenhum artigo é exibido e a mensagem de ausência de resultados aparece', async () => {
      await expect(page).toHaveURL(new RegExp(`\\?s=${termo}`));
      await expect(searchPage.resultados).toHaveCount(0);
      await expect(searchPage.semResultadosMensagem).toBeVisible();
    });
  });
});
