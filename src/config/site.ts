import type { Address, OpeningPeriod } from "@/types";

/**
 * FONTE ÚNICA DOS DADOS DO NEGÓCIO.
 *
 * Regra do projeto: nada aqui é inventado. Somente o que foi fornecido pelo
 * responsável (Instagram, página no AppBarber) ou aparece no material de marca
 * (logotipo e vídeos). Campos ainda não confirmados ficam `null` e os componentes
 * simplesmente não os exibem. Para publicar uma informação, preencha o campo.
 */
export const SITE = {
  name: "Apex Barber",
  /** Assinatura do logotipo oficial ("Style and Excellence"). */
  tagline: "Style and Excellence",
  description:
    "Apex Barber: barbearia de corte e barba. Conheça o trabalho e agende seu horário online.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "pt-BR",
  timezone: "America/Sao_Paulo",
  /** Brasil não adota horário de verão desde 2019: offset fixo. */
  utcOffset: "-03:00",

  social: {
    instagram: {
      handle: "apexbarberofc",
      url: "https://www.instagram.com/apexbarberofc/",
    },
  },

  /** Agenda atual da barbearia (usada como alternativa até a integração própria existir). */
  appbarberUrl: "https://sites.appbarber.com.br/apexbarber-a0ae",

  /** A PREENCHER com dados reais confirmados. */
  contact: {
    phone: null as string | null, // ex.: "(00) 00000-0000"
    whatsappUrl: null as string | null, // ex.: "https://wa.me/55..."
    email: null as string | null,
  },
  address: null as Address | null,
  hours: null as OpeningPeriod[] | null,

  /** Regras do checkout. */
  checkout: {
    requireEmail: false,
  },
  /** Quantos dias à frente o cliente pode agendar. */
  bookingWindowDays: 21,
} as const;

export const NAV_ITEMS = [
  { href: "/#servicos", label: "Serviços", section: "services" },
  { href: "/#sobre", label: "Sobre", section: "about" },
  { href: "/#galeria", label: "Galeria", section: "gallery" },
  { href: "/#equipe", label: "Equipe", section: "team" },
  { href: "/#produtos", label: "Produtos", section: "products" },
  { href: "/#avaliacoes", label: "Avaliações", section: "reviews" },
  { href: "/#contato", label: "Contato", section: "contact" },
] as const;

export type SectionKey = (typeof NAV_ITEMS)[number]["section"];
