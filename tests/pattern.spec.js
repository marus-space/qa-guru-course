import { test, expect } from '@playwright/test';
import { UserBuilder } from '../src/helpers/builders';
import { App } from '../pages/app';


test('Пользователь может зарегистрироваться, используя email и пароль', async ({ page }) => {
  const user = new UserBuilder().withEmail().withUsername().withPassword().build();
  
  const app = new App({ page });
  
  await app.mainPage.goToMainPage();
  await app.mainPage.goToRegister();
  await app.registerPage.signUp(user);

  await expect(app.authenticatedMainPage.getProfileName()).toContainText(user.username);
});
