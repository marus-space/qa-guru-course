import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage } from '../pages/main.page';
import { RegisterPage } from '../pages/register.page';
import { AuthenticatedMainPage } from '../pages/authenticated-main.page';

const url = 'https://realworld.qa.guru/';
const username = faker.person.fullName();
const email = faker.internet.email({ firstName: 'Sniper', provider: 'example.com' });
const password = faker.internet.password({ length: 20 });

test.skip('Пользователь может зарегистрироваться, используя email и пароль', async ({ page }) => {
  await page.goto(url);

  const mainPage = new MainPage({ page });
  const registerPage = new RegisterPage({ page });
  const authenticatedMainPage = new AuthenticatedMainPage({ page });
  
  await mainPage.goToRegister();
  await registerPage.signUp({ username, email, password });

  await expect(authenticatedMainPage.getProfileName()).toContainText(username);
});
