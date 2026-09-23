# Apex Barber — site oficial

Site em [Next.js](https://nextjs.org) (App Router) para a Apex Barber: apresentação,
agendamento online, checkout e confirmação.

## Por que os serviços/preços/equipe aparecem vazios (ou "fictícios")

As duas fontes indicadas para os dados do negócio — o site no AppBarber
(`https://sites.appbarber.com.br/apexbarber-a0ae`) e o Instagram
(`@apexbarberofc`) — **bloqueiam acesso automatizado** (bot detection /
`robots.txt`), então não foi possível extrair de lá a lista real de serviços,
preços, equipe, endereço e horários. Para não inventar nenhuma dessas
informações, o projeto foi entregue em dois estados:

1. **Dados reais** (`src/data/*.ts`, `src/config/site.ts`): ficam vazios/`null`
   onde a informação não foi confirmada. O site continua funcionando nesse
   estado — mostra avisos honestos ("em atualização") com links diretos para
   a agenda no AppBarber e o Instagram, em vez de fingir que a informação
   existe.
2. **Modo demonstração** (`NEXT_PUBLIC_DEMO_DATA=true`, já ativado no
   `.env.local` deste projeto): mostra serviços, preços, equipe e produtos
   **fictícios**, claramente identificados por uma faixa no topo do site, só
   para você testar o fluxo completo de agendamento e checkout ponta a ponta.

A identidade visual (logotipo, cores, tipografia, fotos da galeria e o vídeo
do topo) **é real**, extraída do material que você enviou (vídeos de
atendimento e o logotipo que aparece neles).

## Antes de publicar: preencha os dados reais

1. Abra `src/config/site.ts` e preencha `contact`, `address` e `hours`.
2. Abra `src/data/services.ts`, `src/data/professionals.ts` e
   `src/data/products.ts` e preencha as listas `SERVICES`, `PROFESSIONALS` e
   `PRODUCTS` (copiando do AppBarber/Instagram).
3. Se tiver avaliações reais para mostrar, preencha `src/data/reviews.ts`.
4. Apague ou desative o `.env.local` (ou mude `NEXT_PUBLIC_DEMO_DATA` para
   `false`) — veja `docs/PUBLICACAO.md`.
5. Configure o agendamento e o pagamento reais — veja `docs/INTEGRACOES.md`.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Com o `.env.local` padrão (modo demonstração), o
agendamento e o checkout funcionam de ponta a ponta com dados fictícios.

## Scripts

| Comando               | O que faz                                          |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Ambiente de desenvolvimento                         |
| `npm run build`        | Build de produção                                   |
| `npm run start`        | Roda o build de produção                            |
| `npm run typecheck`    | Verifica os tipos TypeScript                        |
| `npm run lint`         | ESLint (`next/core-web-vitals` + TypeScript)         |
| `npm run test:e2e`     | Testes end-to-end com Playwright                     |
| `npm run check`        | typecheck + lint + build, tudo de uma vez            |

## Estrutura do projeto

```
src/
  app/                Páginas e rotas (App Router)
    page.tsx           Home
    agendar/           Fluxo de agendamento
    checkout/          Checkout
    sucesso/           Confirmação
    privacidade/       Política de privacidade
    api/               Rotas de API (disponibilidade, checkout, pedidos)
  components/
    layout/            Header, Footer, menu mobile, faixa de demo
    sections/           Seções da Home (Hero, Serviços, Sobre, Galeria…)
    booking/            Fluxo de agendamento (cliente)
    checkout/           Resumo do pedido, formulário, confirmação
    ui/                 Ícones
  config/
    site.ts             *** Fonte única dos dados do negócio ***
    env.ts               Leitura de variáveis de ambiente do servidor
  data/                 Serviços, profissionais, produtos, avaliações, galeria
  lib/
    booking/             Camada de agenda (interface + provedor demo)
    payment/              Camada de pagamento (interface + provedor demo)
    orders/                Armazenamento dos pedidos
  types/                 Tipos compartilhados
docs/
  INTEGRACOES.md         Como conectar uma agenda e um gateway de pagamento reais
  PUBLICACAO.md          Checklist para publicar em produção
tests/e2e/                Testes Playwright
```

## Design

Paleta e tipografia extraídas do material de marca real (logotipo e capas de
atendimento nos vídeos enviados): preto profundo, dourado envelhecido e
branco-marfim, com Bodoni Moda (títulos) e Hanken Grotesk (texto/interface).
Veja `src/styles/tokens.css`.

## Qualidade

- **Tipos**: TypeScript estrito, sem erros (`npm run typecheck`).
- **Lint**: `eslint-config-next` (core web vitals + TypeScript), sem erros.
- **Acessibilidade**: testado com axe-core (0 violações WCAG 2.1 A/AA) nas
  páginas principais e no checkout; navegação por teclado, foco preso no menu
  mobile e no lightbox da galeria, rótulos em todos os campos de formulário.
- **Responsivo**: testado em 360, 390, 768, 1024 e 1440px — sem scroll
  horizontal, sem sobreposição.
- **Fluxo completo testado com Playwright**: agendamento → checkout →
  confirmação, incluindo validação de formulário, proteção contra duplo
  envio (com concorrência real testada) e geração do arquivo `.ics`.
