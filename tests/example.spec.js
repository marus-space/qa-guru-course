import { test, expect } from '@playwright/test';

test.skip('Пример', async ({ page }) => {
  await page.goto('file:///Users/marus/Desktop/Projects/personal/qa-guru/burger-order.html');
  await page.locator('#customerName').click();
  await page.locator('.order-form').locator('input').first().fill('Sniper');
  await page.getByRole('textbox', { name: 'Имя клиента' }).fill('Sni');
  // await page.getByRole('textbox', { placeholder: 'Введите ваше имя' }).fill('Sni');
  // await page.getByPlaceholder('Введите ваше имя').fill('Sni');
  await page.getByRole('combobox', { name: 'Тип бургера' }).selectOption('Чизбургер');
  // await page.locator('.formGroup').click();
  // await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  // await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('выгулять собак');
  // await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect(page.getByRole('main')).toContainText('выгулять собак');
});
