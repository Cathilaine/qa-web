export const homeLocators = (page) => ({
  noticiasLink: page.getByRole('link', { name: 'Notícias', exact: true }).first(),
  noticiasHeading: page.getByRole('heading', { name: 'Notícias', level: 1 }),
  articleCards: page.locator('article'),
  articleTitleLink: page.locator('article h3 a').first(),
  pageLink: (numero) => page.getByRole('link', { name: String(numero), exact: true }).first(),
  pageNumberLinks: page.getByRole('link', { name: /^\d+$/ }),
  siteLink: page.getByRole('link', { name: 'Ir para o site', exact: true }).first(),
});
