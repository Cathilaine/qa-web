import { homeLocators } from '../locators/homeLocators';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.locators = homeLocators(page);
  }

  async goto() {
    await this.page.goto('/');
  }

  async irParaNoticias() {
    await this.locators.noticiasLink.click();
  }

  get noticiasHeading() {
    return this.locators.noticiasHeading;
  }

  get artigos() {
    return this.locators.articleCards;
  }

  get primeiroTituloArtigo() {
    return this.locators.articleTitleLink;
  }

  async abrirPrimeiroArtigo() {
    await this.primeiroTituloArtigo.click();
  }

  async irParaPagina(numero) {
    await this.locators.pageLink(numero).click();
  }

  async irParaUltimaPagina() {
    const numeros = (await this.locators.pageNumberLinks.allTextContents()).map(Number);
    const ultima = Math.max(...numeros);
    await this.locators.pageLink(ultima).click();
  }

  async irParaPrimeiraPagina() {
    await this.locators.pageLink(1).click();
  }

  async irParaSite() {
    await this.page.waitForLoadState('networkidle');
    await this.locators.siteLink.click();
  }
}
