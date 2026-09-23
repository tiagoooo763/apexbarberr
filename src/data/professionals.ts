import type { Professional } from "@/types";

/**
 * O material fornecido (vídeos) mostra barbeiros em atendimento, mas não
 * confirma nomes nem especialidades — e não temos acesso ao Instagram/AppBarber
 * para checar. Não inventamos nomes de profissionais reais. Preencha esta
 * lista com nome, especialidade e foto de cada barbeiro para publicá-la.
 */
export const PROFESSIONALS: Professional[] = [];

export const DEMO_PROFESSIONALS: Professional[] = [
  { id: "p1", name: "Rafael Souza", specialty: "Cortes clássicos e degradê" },
  { id: "p2", name: "Bruno Lima", specialty: "Barba e navalha" },
];
