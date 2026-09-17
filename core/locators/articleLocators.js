export const articleLocators = (page) => ({
  heading: page.locator('h1').first(),
  publicadoEm: page.getByText(/Publicado em:/),
});
