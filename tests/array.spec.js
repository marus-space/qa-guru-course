import { test, expect } from '@playwright/test';

const url = 'https://realworld.qa.guru/';

test('Пользователь может просмотреть 3 статьи на Главной', async ({ page }) => {
  await page.goto(url);
  const articles = page.getByRole('link').filter({ has: page.locator('h1') });
  await expect(articles.first()).toBeVisible();
  
  const titles = await articles.locator('h1').allTextContents();
  expect(titles).toHaveLength(3);
});
