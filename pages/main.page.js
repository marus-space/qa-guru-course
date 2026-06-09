export class MainPage {
  constructor({ page }) {
    this.page = page;
    this.baseUrl = 'https://realworld.qa.guru/';
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
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
}
