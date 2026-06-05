export class MainPage {
  constructor({ page }) {
    this.page = page;
    this.baseUrl = 'https://realworld.qa.guru/';
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.articlePreviewLinks = page.getByRole('link').and(page.locator('.preview-link'));
    this.articleAuthorsLinks = page.getByRole('link').and(page.locator('.author'));
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  async goToMainPage() { 
    await this.page.goto(this.baseUrl);
  }

  async goToRegister() {
    await this.signUpLink.click();
  }

  async goToLogin() {
    await this.loginLink.click();
  };

  async getFirstArticlePath() {
    return await this.articlePreviewLinks.first().getAttribute('href');
  }

  async getFirstArticleName() {
    return await this.articlePreviewLinks.first().locator('h1').textContent();
  }

  async clickFirstArticlePreviewLink() {
    await this.articlePreviewLinks.first().click();
  }

  async getFirstArticleAuthorPath() {
    return await this.articleAuthorsLinks.first().getAttribute('href');
  }

  async getFirstArticleAuthorName() {
    return await this.articleAuthorsLinks.first().textContent();
  }

  async clickFirstArticleAuthorLink() {
    await this.articleAuthorsLinks.first().click();
  }
}
