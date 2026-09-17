import { articleLocators } from '../locators/articleLocators';

export class ArticlePage {
  constructor(page) {
    this.page = page;
    this.locators = articleLocators(page);
  }

  get heading() {
    return this.locators.heading;
  }

  get publicadoEm() {
    return this.locators.publicadoEm;
  }
}
