import { AuthenticatedMainPage } from './authenticated-main.page';
import { MainPage } from './main.page';
import { RegisterPage } from './register.page';

export class App {
  constructor({ page }) {
    this.page = page;
    this.authenticatedMainPage = new AuthenticatedMainPage({ page });
    this.mainPage = new MainPage({ page });
    this.registerPage = new RegisterPage({ page });
  }
}
