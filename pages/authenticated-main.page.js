import { MainPage } from "./main.page";

export class AuthenticatedMainPage extends MainPage {
  constructor({ page }) {
    super({ page });
    this.profileDropdown = page.getByRole('listItem').and(page.locator('.dropdown'));
    this.profileName = this.profileDropdown.locator('.dropdown-toggle');
    this.profileLink = this.profileDropdown.getByRole('link', { name: 'Profile' });
    this.globalFeedButton = page.getByRole('button', { name: 'Global Feed' });
    this.addToFavoritesButtons = page.locator('.article-preview').getByRole('button');
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
  }

  getProfileDropdown() {
    return this.profileDropdown;
  }

  async getProfilePath() {
    return await this.profileLink.getAttribute('href');
  }

  async getProfileName() {
    return await this.profileName.textContent();
  }

  async clickProfileDropdown() {
    await this.profileDropdown.click();
  }

  async clickProfileLink() {
    await this.profileLink.click();
  }

  async openGlobalFeed() {
    await this.globalFeedButton.click();
  }

  async getFirstAddToFavoritesButton() {
    return await this.addToFavoritesButtons.first();
  }

  async getFirstAddToFavoritesButtonCount() {
    const text = await this.addToFavoritesButtons.first().locator('.counter').textContent();

    return Number(text.match(/\d+/)[0]);
  }

  async clickFirstAddToFavoritesButton() {
    await this.addToFavoritesButtons.first().click();
  }

  async getIsFirstAddToFavoritesButtonActive() {
    const classNames = await this.addToFavoritesButtons.first().getAttribute('class');

    return classNames?.includes('active') ?? false;
  }

  async getNewArticlePath() {
    return await this.newArticleLink.getAttribute('href');
  };

  async clickNewArticleLink() {
    await this.newArticleLink.click();
  }
}
