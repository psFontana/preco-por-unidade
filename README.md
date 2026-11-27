# Preço por unidade

Comparador de embalagens para compras de supermercado. A aplicação calcula o preço por quilo, litro ou unidade para que embalagens de tamanhos diferentes possam ser comparadas.

Trabalho prático da disciplina de Integração Contínua da UTFPR. A branch `main` reúne as entregas estáveis. Cada etapa do projeto passa por uma branch curta e um pull request, com o histórico das verificações associado ao commit.

## Desenvolvimento local

O projeto usa React, TypeScript e Vite. Com Node.js 22.12 ou superior, a instalação e o servidor de desenvolvimento são iniciados pelos comandos abaixo.

```sh
npm ci
npm run dev
```

O comando `npm run build` verifica os tipos e gera o site estático em `dist/`. O GitHub Actions executa a instalação e o build em pull requests para `main` e a cada atualização dessa branch.

## Comparação de embalagens

A interface aceita gramas, quilos, mililitros, litros e contagem por unidade. O resultado muda a cada edição. No exemplo inicial, 500 g por R$ 8,00 correspondem a R$ 16,00/kg. A embalagem de 1 kg por R$ 15,00 oferece economia de 6,25% por quilo.

O módulo de cálculo normaliza quantidades e compara produtos cruzados com inteiros. O arredondamento em reais ocorre na apresentação. Os testes de regra e de interface rodam com `npm test`.

O [primeiro build](https://github.com/psFontana/preco-por-unidade/actions/runs/45944634989) validou a estrutura da SPA. No [PR do comparador](https://github.com/psFontana/preco-por-unidade/pull/2), o [teste de conversão falhou](https://github.com/psFontana/preco-por-unidade/actions/runs/45944764294) ao comparar unidades diferentes. A [execução seguinte](https://github.com/psFontana/preco-por-unidade/actions/runs/45944939940) aprovou a correção.

