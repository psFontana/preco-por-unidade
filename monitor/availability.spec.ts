import { expect, test } from '@playwright/test'

test('a página pública responde e compara 500 g com 1 kg', async ({ page }) => {
  const response = await page.goto('./')
  expect(response?.status()).toBe(200)
  await page.getByRole('button', { name: 'Limpar campos' }).click()
  const first = page.getByRole('group', { name: 'Embalagem A' })
  const second = page.getByRole('group', { name: 'Embalagem B' })
  await first.getByRole('textbox', { name: /Preço/ }).fill('8,00')
  await first.getByRole('textbox', { name: 'Quantidade' }).fill('500')
  await first.getByRole('combobox').selectOption('g')
  await second.getByRole('textbox', { name: /Preço/ }).fill('15,00')
  await second.getByRole('textbox', { name: 'Quantidade' }).fill('1')
  await second.getByRole('combobox').selectOption('kg')
  const result = page.getByRole('complementary', { name: 'Resultado da comparação' })
  await expect(result.getByRole('heading')).toHaveText('Embalagem B compensa')
  await expect(result).toContainText(/R\$\s*16,00\/kg/)
  await expect(result).toContainText(/R\$\s*15,00\/kg/)
})
