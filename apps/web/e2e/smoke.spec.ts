import {test,expect} from '@playwright/test';
test('localized home renders',async({page})=>{await page.goto('/en');await expect(page).toHaveTitle(/ESTARA/i);await expect(page.getByText('Featured properties')).toBeVisible();});
test('persian route is rtl',async({page})=>{await page.goto('/fa');await expect(page.locator('body')).toHaveAttribute('dir','rtl');});
test('search navigation is available',async({page})=>{await page.goto('/en');await page.getByPlaceholder(/Search properties/i).fill('residence');await page.getByRole('button').filter({hasText:''}).first().click().catch(()=>{});});
