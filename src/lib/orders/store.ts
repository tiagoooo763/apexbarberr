import "server-only";
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import type { Order } from "@/types";

/**
 * Armazenamento de pedidos para o ambiente de demonstração/preview.
 *
 * Por que um arquivo, e não um `Map` em memória: em builds do Next.js com
 * Turbopack, route handlers (`app/api/**\/route.ts`) e páginas de Server
 * Component (`app/**\/page.tsx`) podem rodar em grafos de módulo separados —
 * ou seja, um `const orders = new Map()` no topo do módulo NÃO é
 * necessariamente a mesma instância vista pelas duas partes, mesmo dentro do
 * mesmo processo Node. Isso foi verificado na prática: a rota `/api/checkout`
 * salvava o pedido, mas a página `/sucesso` não o encontrava. Escrever num
 * arquivo evita esse problema porque ambos os lados leem/escrevem o mesmo
 * arquivo em disco, independentemente de qual módulo os executa.
 *
 * IMPORTANTE para produção real: isto ainda é um armazenamento de arquivo
 * único, adequado para demonstração/preview em uma única instância — não é
 * seguro para concorrência pesada nem sobrevive a hospedagens serverless
 * multi-instância. Antes de operar com clientes reais, troque por um banco
 * de dados (Postgres, SQLite gerenciado, etc.); o restante do código só fala
 * com `saveOrder`/`getOrder`, então a troca fica isolada neste arquivo.
 */
const DATA_FILE = join(process.cwd(), ".data", "orders.json");

function readAll(): Record<string, Order> {
  try {
    if (!existsSync(DATA_FILE)) return {};
    const raw = readFileSync(DATA_FILE, "utf-8");
    return raw.trim() ? (JSON.parse(raw) as Record<string, Order>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, Order>): void {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  // escrita atômica: grava num arquivo temporário e renomeia por cima,
  // evitando um arquivo corrompido se duas requisições escreverem ao mesmo tempo.
  const tmp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmp, JSON.stringify(data), "utf-8");
  renameSync(tmp, DATA_FILE);
}

export function saveOrder(order: Order): void {
  const all = readAll();
  all[order.id] = order;
  writeAll(all);
}

export function getOrder(id: string): Order | undefined {
  return readAll()[id];
}
