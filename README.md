# Preço por unidade

Uma embalagem de 500 g por R$ 8,00 ou outra de 1 kg por R$ 15,00? O comparador mostra o preço na mesma unidade de medida. Nesse exemplo, os preços são R$ 16,00/kg e R$ 15,00/kg. A segunda opção economiza 6,25% por quilo.

Trabalho prático de Integração Contínua da UTFPR. [Aplicação publicada](https://psfontana.github.io/preco-por-unidade/) · [Roteiro da apresentação](docs/apresentacao.md)

## Aplicação

A SPA compara massa (g e kg), volume (mL e L) ou contagem (un). Os valores podem usar vírgula ou ponto decimal. O resultado acompanha a edição, indica empates e identifica campos vazios, valores inválidos e medidas incompatíveis. O formulário começa com o exemplo acima e permite limpar os dois campos de preço e quantidade.

A interface foi construída com React e TypeScript. O formulário mantém os dados em memória e chama o módulo de cálculo a cada alteração. O módulo normaliza as quantidades e compara os preços por produtos cruzados com inteiros. A economia percentual toma a opção mais cara como referência. O arredondamento em reais ocorre na exibição. A aplicação e as fontes são estáticas, e nenhum dado da compra é enviado a um servidor.

## Desenvolvimento

O ambiente de referência usa Node.js 22 (a partir de 22.13), npm e o lockfile versionado.

```sh
npm ci
npm run dev
```

| Comando | Resultado |
| --- | --- |
| `npm run lint` | ESLint no código da aplicação, testes e configuração |
| `npm run typecheck` | Verificação estática de tipos pelo TypeScript |
| `npm test` | Testes de cálculo e interação da interface com Vitest |
| `npm run coverage` | Cobertura do módulo de cálculo e relatório em `coverage/` |
| `npm run build` | Verificação de tipos e build de produção em `dist/` |
| `npm run preview` | Servidor local do build para conferência no navegador |

## Git e pipeline

A `main` recebe mudanças por pull request. Branches curtas separam funcionalidade, integração, publicação e documentação. O check obrigatório **Build** precisa passar antes do merge. Os commits das branches ficam preservados no histórico. A tag `v1.0.0` identifica a entrega e a imagem de contêiner correspondente.

O [workflow de integração](.github/workflows/ci.yml) roda em PRs para `main` e em cada atualização da branch. A sequência é instalação pelo lockfile, lint e tipos, testes e cobertura, segurança e build. Na `main`, seguem a publicação do artefato e a verificação da versão no ar.

### Testes e cobertura

O Vitest cobre as conversões de massa e volume, preço por unidade, empate, arredondamento, campos vazios, valores inválidos e medidas incompatíveis. O teste de interface preenche as embalagens, confere os preços exibidos e altera os dados até obter empate. O provedor V8 exige ao menos **80% de linhas e 80% de ramificações** em `src/comparison.ts`. O relatório HTML também é anexado como artefato `cobertura`.

### Segurança

| Ferramenta | Verificação que interrompe o pipeline |
| --- | --- |
| npm audit | Vulnerabilidade alta ou crítica nas dependências de produção ou desenvolvimento |
| Semgrep | Inserção direta de HTML ou avaliação dinâmica de código segundo as [regras SAST do projeto](.semgrep.yml) |
| Gitleaks | Detecção de segredo no histórico Git obtido pelo workflow, com valores ocultos nos logs |

As Actions são fixadas por SHA e as imagens dos scanners por digest. Os jobs de validação têm acesso de leitura. O deploy recebe permissão de publicação no Pages e identidade OIDC. A publicação da imagem usa o token temporário do GitHub com escrita em pacotes. A URL do monitor é uma configuração pública; a SPA dispensa credenciais.

## Build e publicação

O Vite gera `dist/index.html` e os arquivos JavaScript, CSS e fontes em `dist/assets/`. Os caminhos relativos permitem servir o site sob `/preco-por-unidade/` ou na raiz do contêiner. O build da `main` envia `dist/` como artefato `github-pages`. O job de deploy publica esse mesmo pacote no ambiente `github-pages`. [Build, artefatos e deploy](https://github.com/psFontana/preco-por-unidade/actions/runs/45945619113)

## Monitoramento

O [workflow do monitor](.github/workflows/monitor.yml) roda após o deploy, por acionamento manual e a cada seis horas (02h31, 08h31, 14h31 e 20h31 no horário de Brasília). O Playwright abre a URL pública em Chromium, exige HTTP 200, limpa o formulário e digita a comparação de referência. O teste exige **R$ 16,00/kg**, **R$ 15,00/kg** e **Embalagem B compensa**. Se a página ou o JavaScript falhar, há uma nova tentativa. Uma falha persistente deixa a execução vermelha e disponibiliza a captura de tela e o trace.

A reprodução local usa `npm run build` e `npm run preview`. Com o servidor em funcionamento, os comandos abaixo rodam o mesmo cenário. A variável `SITE_URL` permite apontar para a aplicação publicada. [Histórico das verificações agendadas](https://github.com/psFontana/preco-por-unidade/actions/workflows/monitor.yml?query=event%3Aschedule)

```sh
npx playwright install chromium
npm run monitor
```

## Docker

O [Dockerfile](Dockerfile) empacota o conteúdo de `dist/` com Nginx sem privilégios na porta 8080. O [workflow da imagem](.github/workflows/docker.yml) inicia o contêiner e executa a comparação real. Em tags de versão presentes na `main`, o job de publicação recupera e envia ao GHCR a imagem que passou no teste.

```sh
npm ci
npm run build
docker build -t preco-por-unidade:local .
docker run --rm -p 8080:8080 preco-por-unidade:local
```

O endereço local é `http://localhost:8080/`. A referência de registro para a entrega é `ghcr.io/psfontana/preco-por-unidade:v1.0.0`.

## Evidências

| Etapa | Registro |
| --- | --- |
| Primeira integração | [PR inicial](https://github.com/psFontana/preco-por-unidade/pull/1) e [build aprovado](https://github.com/psFontana/preco-por-unidade/actions/runs/45944634989) |
| Evolução de uma regra | [PR do comparador](https://github.com/psFontana/preco-por-unidade/pull/2), [teste de conversão falhando](https://github.com/psFontana/preco-por-unidade/actions/runs/45944764294) e [mesmo teste após a correção](https://github.com/psFontana/preco-por-unidade/actions/runs/45944939940) |
| Qualidade e segurança | [Execução com cobertura, auditoria, SAST e secret scanning](https://github.com/psFontana/preco-por-unidade/actions/runs/45945312727) |
| Entrega e operação | [Deploy e verificação pós-publicação](https://github.com/psFontana/preco-por-unidade/actions/runs/45945619113) e [monitor manual](https://github.com/psFontana/preco-por-unidade/actions/runs/45945830010) e [execução agendada aprovada](https://github.com/psFontana/preco-por-unidade/actions/runs/46025409552) |
| Contêiner | [Build da imagem e comparação em execução](https://github.com/psFontana/preco-por-unidade/actions/runs/45945758501) |
