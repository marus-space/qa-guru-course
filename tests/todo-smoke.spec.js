import { test, expect } from '@playwright/test';

test.describe('TodoMVC smoke', () => {
  test('добавить новую задачу', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/vue/dist/#/');

    await page.getByPlaceholder('What needs to be done?').fill('Write Playwright tests');
    await page.keyboard.press('Enter');

    const todoItem = page.getByTestId('todo-item');
    await expect(todoItem).toHaveCount(1);
    await expect(todoItem).toContainText('Write Playwright tests');
  });

  test('отметить задачу как выполненную', async ({ page }) => {
    await page.goto('https://todomvc.com/examples/vue/dist/#/');

    await page.getByPlaceholder('What needs to be done?').fill('Complete this task');
    await page.keyboard.press('Enter');

    await page.getByRole('checkbox').click();

    await expect(page.getByTestId('todo-item')).toHaveClass(/completed/);
  });
});
