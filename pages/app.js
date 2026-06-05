import { ArticlePage } from './article.page';
import { AuthenticatedMainPage } from './authenticated-main.page';
import { LoginPage } from './login.page';
import { MainPage } from './main.page';
import { NewArticlePage } from './new-article.page';
import { RegisterPage } from './register.page';
import { UserProfilePage } from './user-profile.page';

export class App {
  constructor({ page }) {
    this.page = page;
    this.articlePage = new ArticlePage({ page });
    this.authenticatedMainPage = new AuthenticatedMainPage({ page });
    this.loginPage = new LoginPage({ page });
    this.mainPage = new MainPage({ page });
    this.newArticlePage = new NewArticlePage({ page });
    this.registerPage = new RegisterPage({ page });
    this.userProfilePage = new UserProfilePage({ page });
  }
}
