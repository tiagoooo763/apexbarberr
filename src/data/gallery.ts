import type { GalleryItem } from "@/types";

/**
 * Imagens extraídas dos vídeos de atendimento fornecidos diretamente pelo
 * responsável pela Apex Barber (uploads desta conversa) — conteúdo próprio da
 * barbearia, mostrando o trabalho real feito na cadeira.
 */
export const GALLERY: GalleryItem[] = [
  { image: { src: "/images/galeria-tesoura.webp", alt: "Acabamento na tesoura durante um corte na Apex Barber", width: 720, height: 1280 } },
  { image: { src: "/images/galeria-navalha.webp", alt: "Barbeiro da Apex Barber preparando a navalha para o acabamento", width: 720, height: 1280 } },
  { image: { src: "/images/galeria-vapor.webp", alt: "Toalha de vapor aplicada durante o atendimento de barba", width: 720, height: 1280 } },
  { image: { src: "/images/galeria-maquina.webp", alt: "Acabamento de barba com máquina de precisão", width: 720, height: 1280 } },
  { image: { src: "/images/galeria-degrade.webp", alt: "Resultado final de um corte degradê na Apex Barber", width: 720, height: 1280 } },
  { image: { src: "/images/galeria-acabamento.webp", alt: "Detalhe do acabamento da barba na Apex Barber", width: 720, height: 1280 } },
  { image: { src: "/images/galeria-barba-completa.webp", alt: "Barba finalizada em cliente atendido na Apex Barber", width: 720, height: 1280 } },
  { image: { src: "/images/galeria-atendimento.webp", alt: "Atendimento em andamento na cadeira da Apex Barber", width: 720, height: 1280 } },
];
