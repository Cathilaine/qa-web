import { searchLocators } from '../locators/searchLocators';

export class SearchPage {
  constructor(page) {
    this.page = page;
    this.locators = searchLocators(page);
  }

  async buscar(termo) {
    await this.page.goto(`/?s=${encodeURIComponent(termo)}`);
  }

  get heading() {
    return this.locators.heading;
  }

  get resultados() {
    return this.locators.resultados;
  }

  get semResultadosMensagem() {
    return this.locators.semResultadosMensagem;
  }
}
