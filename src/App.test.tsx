// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { App } from './App'

afterEach(cleanup)

it('compara duas embalagens digitadas e atualiza o resultado quando os valores mudam', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Limpar campos' }))
  expect(screen.getByText('Comparação pendente')).toBeDefined()
  const a = within(screen.getByRole('group', { name: 'Embalagem A' }))
  const b = within(screen.getByRole('group', { name: 'Embalagem B' }))
  fireEvent.change(a.getByRole('textbox', { name: /Preço/ }), { target: { value: '8,00' } })
  fireEvent.change(a.getByLabelText('Quantidade'), { target: { value: '500' } })
  fireEvent.change(a.getByRole('combobox'), { target: { value: 'g' } })
  fireEvent.change(b.getByRole('textbox', { name: /Preço/ }), { target: { value: '15,00' } })
  fireEvent.change(b.getByLabelText('Quantidade'), { target: { value: '1' } })
  fireEvent.change(b.getByRole('combobox'), { target: { value: 'kg' } })
  expect(
    screen.getByRole('heading', { name: 'Embalagem B compensa' }),
  ).toBeDefined()
  const receipt = screen.getByRole('complementary', {
    name: 'Resultado da comparação',
  })
  expect(receipt.textContent).toMatch(/R\$\s*16,00\/kg/)
  expect(receipt.textContent).toMatch(/R\$\s*15,00\/kg/)
  fireEvent.change(b.getByRole('textbox', { name: /Preço/ }), { target: { value: '16' } })
  expect(screen.getByRole('heading', { name: 'Preços iguais' })).toBeDefined()
  fireEvent.change(b.getByRole('combobox'), { target: { value: 'L' } })
  expect(receipt.textContent).toMatch(/medidas compatíveis/)
  fireEvent.click(screen.getByRole('button', { name: 'Usar exemplo' }))
  expect(
    screen.getByRole('heading', { name: 'Embalagem B compensa' }),
  ).toBeDefined()
})
