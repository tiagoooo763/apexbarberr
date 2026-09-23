# Integrações reais: agenda e pagamento

O site já vem com toda a interface e a lógica do fluxo de agendamento e
checkout prontas. O que falta, quando vocês tiverem escolhido os
fornecedores, é implementar duas interfaces já definidas no código — nada
mais no site precisa mudar.

## Por que está assim

O pedido original foi claro: não fingir uma integração que não existe. Por
isso, hoje:

- `BOOKING_PROVIDER` e `PAYMENT_PROVIDER` (no `.env`) controlam se o
  agendamento/checkout online estão *ligados*. Vazios = desligados, e o site
  mostra honestamente um link para a agenda atual no AppBarber em vez de um
  formulário que não funcionaria de verdade.
- `demo` é um provedor de mentira para os dois, que serve só para você testar
  o fluxo (não fala com nenhum sistema real).

## Passo a passo para conectar uma agenda real

1. Crie um arquivo novo em `src/lib/booking/`, por exemplo `appbarber.ts`
   (ou o nome do sistema que vocês forem usar).
2. Implemente a interface `BookingProvider` (definida em
   `src/lib/booking/provider.ts`): dois métodos, `getAvailableSlots` e
   `createAppointment`, usando a API real do sistema de agenda.
3. Em `src/lib/booking/index.ts`, adicione mais um `case` no `switch`
   apontando para o seu novo provedor.
4. No `.env`, defina `BOOKING_PROVIDER=appbarber` (ou o nome que você usou).

## Passo a passo para conectar um gateway de pagamento real

1. Crie um arquivo novo em `src/lib/payment/`, por exemplo `mercadopago.ts`
   ou `stripe.ts`.
2. Implemente a interface `PaymentProvider` (definida em
   `src/lib/payment/provider.ts`): um método `charge`, usando o SDK oficial
   do gateway.
3. Guarde as credenciais **somente** em variáveis de ambiente do servidor
   (nunca com prefixo `NEXT_PUBLIC_`, e nunca direto no código) — veja
   `.env.example`.
4. Em `src/lib/payment/index.ts`, adicione mais um `case` apontando para o
   seu novo provedor.
5. No `.env`, defina `PAYMENT_PROVIDER=mercadopago` (ou o nome que você usou)
   e as credenciais correspondentes.

Se o gateway escolhido exigir campos de cartão coletados na própria página
(em vez de redirecionar para um checkout hospedado), troque o cartão
"Pagamento" em `src/components/checkout/CheckoutForm.tsx` pelos componentes
oficiais do gateway (ex.: Payment Element do Stripe) — eles cuidam de manter
os dados de cartão fora do seu servidor (conformidade PCI).

## Sobre o armazenamento de pedidos

Hoje os pedidos ficam em `.data/orders.json`, um arquivo local — suficiente
para demonstração e para uma primeira publicação de baixo tráfego, mas não
para produção séria (não resiste a múltiplas instâncias/servidores, e um
deploy pode apagar o arquivo). Antes de operar com clientes de verdade,
troque `src/lib/orders/store.ts` por um banco de dados de verdade (Postgres,
SQLite gerenciado etc.) — as funções `saveOrder`/`getOrder` são o único
lugar que precisa mudar.
