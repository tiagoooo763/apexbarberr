import type { Service } from "@/types";

/**
 * Não foi possível acessar o AppBarber nem o Instagram da Apex Barber de forma
 * automatizada (ambos bloqueiam acesso automatizado/robô) para extrair a lista
 * real de serviços, preços e durações. Em vez de inventar valores, a lista
 * abaixo fica vazia por padrão — a seção "Serviços" do site usa esse estado
 * vazio para mostrar um aviso e o link direto para a agenda oficial no AppBarber.
 *
 * Para publicar os serviços reais: preencha os itens abaixo (nome, preço em
 * centavos, duração) copiando da agenda em https://sites.appbarber.com.br/apexbarber-a0ae
 * ou do Instagram @apexbarberofc, e o site passa a exibi-los automaticamente.
 */
export const SERVICES: Service[] = [];

/** Serviços fictícios usados SOMENTE quando NEXT_PUBLIC_DEMO_DATA=true. */
export const DEMO_SERVICES: Service[] = [
  { id: "corte", name: "Corte", description: "Corte na tesoura e máquina, com acabamento.", priceCents: 5000, durationMin: 40 },
  { id: "barba", name: "Barba", description: "Modelagem completa com toalha quente e navalha.", priceCents: 4000, durationMin: 30 },
  { id: "corte-barba", name: "Corte + Barba", description: "Combo completo de corte e barba.", priceCents: 8500, promoPriceCents: 8000, promoLabel: "Combo", durationMin: 70 },
  { id: "sobrancelha", name: "Sobrancelha", description: "Design e acabamento na navalha.", priceCents: 2000, durationMin: 15 },
];
