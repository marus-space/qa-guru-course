import { ArticlePage } from './article.page';
import { AuthenticatedMainPage } from './authenticated-main.page';
import { LoginPage } from './login.page';
import { MainPage } from './main.page';
import { NewArticlePage } from './new-article.page';
import { RegisterPage } from './register.page';
import { UserProfilePage } from './user-profile.page';
import { UserProfileSettingsPage } from './user-profile-settings.page';
import { EditArticlePage } from './edit-article.page';

export class App {
  constructor({ page }) {
    this.page = page;
    this.articlePage = new ArticlePage({ page });
    this.authenticatedMainPage = new AuthenticatedMainPage({ page });
    this.loginPage = new LoginPage({ page });
    this.mainPage = new MainPage({ page });
    this.newArticlePage = new NewArticlePage({ page });
    this.registerPage = new RegisterPage({ page });
    this.editArticlePage = new EditArticlePage({ page });
    this.userProfilePage = new UserProfilePage({ page });
    this.userProfileSettingsPage = new UserProfileSettingsPage({ page });
  }
}
