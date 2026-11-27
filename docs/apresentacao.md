# Roteiro da apresentação

Duração sugerida de cinco minutos. O fio da apresentação é a conversão de 500 g por R$ 8,00 e 1 kg por R$ 15,00.

| Tempo | Tela | Ponto para a fala |
| --- | --- | --- |
| 0:00–0:35 | [Comparador publicado](https://psfontana.github.io/preco-por-unidade/) | Os tamanhos diferentes dificultam a comparação no mercado. Por quilo, a embalagem A custa R$ 16,00 e a B custa R$ 15,00. Ao mudar B para R$ 16,00, o resultado passa a empate. |
| 0:35–1:10 | [PR da funcionalidade](https://github.com/psFontana/preco-por-unidade/pull/2) e [código de cálculo](../src/comparison.ts) | A interface React passa preço, quantidade e unidade para uma função testável. Cada mudança tem uma branch e um PR; o check obrigatório protege a versão publicada. |
| 1:10–2:00 | [Execução com falha](https://github.com/psFontana/preco-por-unidade/actions/runs/45944764294) e [execução corrigida](https://github.com/psFontana/preco-por-unidade/actions/runs/45944939940) | O primeiro teste falhou porque g e kg eram tratados como incompatíveis. O commit seguinte comparou a unidade de referência das duas embalagens. O mesmo teste passou. |
| 2:00–3:05 | [Job de build e validação](https://github.com/psFontana/preco-por-unidade/actions/runs/45945619113/job/140329511040) | O lockfile reproduz a instalação. ESLint e TypeScript verificam o código. Vitest testa cálculo e interface, com piso de 80% em linhas e ramificações no cálculo. npm audit verifica dependências, Semgrep verifica o código e Gitleaks percorre o histórico. Uma falha bloqueia a entrega. |
| 3:05–3:45 | [Execução com artefatos e deploy](https://github.com/psFontana/preco-por-unidade/actions/runs/45945619113) | O Vite gera HTML, JavaScript, CSS e fontes em `dist/`. O artefato `github-pages` passa do build ao deploy. O job seguinte abre o endereço publicado e testa a comparação. |
| 3:45–4:25 | [Monitor independente](https://github.com/psFontana/preco-por-unidade/actions/runs/45945830010) e [execução agendada](https://github.com/psFontana/preco-por-unidade/actions/runs/46025409552) | A cada seis horas o Playwright confere HTTP 200, preenche os campos e exige o resultado esperado. Uma página em branco pode responder 200; o teste de interação detecta esse caso. |
| 4:25–5:00 | [Validação do Docker](https://github.com/psFontana/preco-por-unidade/actions/runs/45945758501) e [workflow de publicação da imagem](https://github.com/psFontana/preco-por-unidade/actions/workflows/docker.yml) | O contêiner serve o mesmo tipo de artefato com Nginx. O workflow inicia a imagem, repete a comparação e publica a versão testada quando a tag é criada. |

Para a demonstração local de Docker, os comandos de build e execução estão no [README](../README.md#docker). O contêiner responde em `http://localhost:8080/`.
