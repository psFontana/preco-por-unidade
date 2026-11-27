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


## Qualidade e segurança

O ESLint e o TypeScript verificam o código antes da compilação. O Vitest coleta linhas e ramificações de `src/comparison.ts` com o provedor V8. O limite é 80% em cada métrica. O relatório HTML fica em `coverage/` e no artefato `cobertura` da execução.

O pipeline verifica vulnerabilidades altas ou críticas nas dependências de produção e desenvolvimento com `npm audit`. O Semgrep aplica as regras versionadas para inserção direta de HTML e avaliação de código em JavaScript/TypeScript. O Gitleaks percorre o histórico do Git com os valores sensíveis ocultos no log. Um achado nas regras selecionadas ou uma falha nos verificadores bloqueia o build. As Actions são referenciadas por SHA, e as imagens dos scanners por digest. A aplicação não usa chaves de API.

## Publicação e disponibilidade

O GitHub Actions gera `dist/` com o HTML, JavaScript, CSS e fontes. Os caminhos relativos do Vite funcionam sob `/preco-por-unidade/`. Na `main`, o job de publicação recebe o artefato `github-pages` da mesma execução e o entrega ao [site público](https://psfontana.github.io/preco-por-unidade/). Somente o job de deploy recebe as permissões de Pages e de identidade necessárias.

O [monitoramento](https://github.com/psFontana/preco-por-unidade/actions/workflows/monitor.yml) roda após o deploy e também de forma independente a cada seis horas, aos 31 minutos das 05h, 11h, 17h e 23h UTC. A execução manual usa o mesmo teste Playwright. O Chromium abre a URL pública, exige HTTP 200, limpa o formulário e preenche o exemplo de 500 g e 1 kg. A verificação falha quando a página fica inacessível ou devolve um resultado incorreto, mesmo que o servidor responda HTTP 200. O log, a captura de tela e o trace permitem investigar as falhas.

Na reprodução local, `npm run preview` serve o build em outra janela. Com o navegador instalado por `npx playwright install chromium`, `npm run monitor` usa essa URL local. A variável pública `SITE_URL` seleciona outro endereço.
