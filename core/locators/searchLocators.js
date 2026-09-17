export const searchLocators = (page) => ({
  heading: page.locator('h1').first(),
  resultados: page.locator('article'),
  semResultadosMensagem: page.getByText(/nada foi encontrado para sua pesquisa/i),
});
