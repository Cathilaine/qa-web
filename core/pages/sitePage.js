import { siteLocators } from '../locators/siteLocators';

export class SitePage {
  constructor(page) {
    this.page = page;
    this.locators = siteLocators(page);
  }

  get heading() {
    return this.locators.heading;
  }
}
