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
