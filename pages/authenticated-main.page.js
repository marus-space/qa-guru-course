import { MainPage } from "./main.page";

export class AuthenticatedMainPage extends MainPage {
  constructor({ page }) {
    super({ page });
    this.profileDropdown = page.getByRole('listItem').and(page.locator('.dropdown'));
    this.profileLink = this.profileDropdown.getByRole('link', { name: 'Profile' });
    this.settingsLink = this.profileDropdown.getByRole('link', { name: 'Settings' });
    this.newArticlePageLink = page.getByRole('link', { name: 'New Article' });
  }

  getProfileDropdown() {
    return this.profileDropdown;
  }

  async clickDropdownProfileLink() {
    await this.profileDropdown.click();
    await this.profileLink.click();
  }

  async clickDropdownSettingsLink() {
    await this.profileDropdown.click();
    await this.settingsLink.click();
  }

  async getNewArticlePagePath() {
    return await this.newArticlePageLink.getAttribute('href');
  };

  async clickNewArticlePageLink() {
    await this.newArticlePageLink.click();
  }
}
