import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const url = 'https://realworld.qa.guru/';
const username = faker.person.fullName();
const email = faker.internet.email({ firstName: 'Sniper', provider: 'example.com' });
const password = faker.internet.password({ length: 20 });

test.skip('Пользователь может зарегистрироваться, используя email и пароль', async ({ page }) => {
  const fillField = async (name, value) => {
    await page.getByRole('textbox', { name }).click();
    await page.getByRole('textbox', { name }).fill(value);
  };
  
  await page.goto(url);
  await page.getByRole('link', { name: 'Sign up' }).click();

  await fillField('Your Name', username);
  await fillField('Email', email);
  await fillField('Password', password);

  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.getByRole('navigation')).toContainText(username);
});
