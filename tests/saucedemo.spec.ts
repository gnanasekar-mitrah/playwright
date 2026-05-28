import {test, expect} from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('Authentication', () => {
  test.beforeEach(async ({page}) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test('should login successfully', async ({page}) => {
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('should logout successfully', async ({page}) => {
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL(BASE_URL);
  });
});

test.describe('Shopping Flow', () => {
  test.beforeEach(async ({page}) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test('should add item to cart', async ({page}) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  test('should proceed through checkout', async ({page}) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.locator('#shopping_cart_container').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });

  test('should complete purchase', async ({page}) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.locator('#shopping_cart_container').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
  });
});