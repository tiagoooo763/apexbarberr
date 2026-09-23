# Checklist para publicar em produção

## 1. Dados do negócio
- [ ] `src/config/site.ts`: preencher `contact` (telefone/WhatsApp/e-mail),
      `address` e `hours`.
- [ ] `src/data/services.ts`: preencher `SERVICES` com nome, preço (em
      centavos), duração.
- [ ] `src/data/professionals.ts`: preencher `PROFESSIONALS`, se aplicável.
- [ ] `src/data/products.ts`: preencher `PRODUCTS`, se aplicável.
- [ ] `src/data/reviews.ts`: preencher `REVIEWS` só com avaliações reais.
- [ ] Conferir as fotos em `public/images/` e trocar por fotos oficiais em
      alta resolução, se quiser ampliar a galeria.

## 2. Desligar o modo demonstração
- [ ] Apagar o `.env.local` (ele só existe para você testar localmente) **ou**
      garantir que, no ambiente de produção (painel da hospedagem), a
      variável `NEXT_PUBLIC_DEMO_DATA` não esteja definida como `true`.

## 3. Agenda e pagamento reais
- [ ] Seguir `docs/INTEGRACOES.md` para conectar a agenda e o gateway de
      pagamento escolhidos.
- [ ] Definir `BOOKING_PROVIDER` e `PAYMENT_PROVIDER` no ambiente de
      produção.
- [ ] Trocar `src/lib/orders/store.ts` por um banco de dados real antes de
      operar com volume.

## 4. Domínio e variáveis de ambiente
- [ ] Definir `NEXT_PUBLIC_SITE_URL` com o domínio final
      (ex.: `https://www.apexbarber.com.br`) — usado no SEO, sitemap e Open
      Graph.
- [ ] Conferir `public/og.jpg` (imagem de compartilhamento) e trocar se
      quiser uma versão com foto em vez do logotipo.

## 5. Build e testes finais
- [ ] `npm run check` (tipos + lint + build) sem erros.
- [ ] Testar o fluxo completo de agendamento → checkout → confirmação com os
      dados reais.
- [ ] Testar em um celular de verdade, não só no navegador do computador.

## 6. Hospedagem
Este é um projeto Next.js padrão (App Router) e roda em qualquer hospedagem
que suporte Node.js com rotas de API server-side (Vercel, um servidor próprio
com `npm run build && npm run start`, etc.). Não é um site 100% estático,
porque o checkout e a disponibilidade de horários dependem de rotas de
servidor.
