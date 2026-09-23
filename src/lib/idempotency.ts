import "server-only";
import { writeFileSync, readFileSync, mkdirSync, existsSync, statSync } from "fs";
import { join } from "path";

/**
 * Bloqueia envios duplicados do checkout (double-submit, duplo clique, F5, ou
 * duas abas) de forma que resiste a CONCORRÊNCIA REAL — duas requisições
 * chegando quase ao mesmo tempo com a mesma chave.
 *
 * Uma verificação do tipo "checar no mapa, depois gravar no mapa" não é
 * atômica: como há uma etapa assíncrona (cobrança) entre as duas, duas
 * requisições concorrentes podem passar pela checagem antes de qualquer uma
 * registrar a chave, e cada uma cria um pedido separado. Isso foi verificado
 * na prática. Para evitar isso, usamos a criação exclusiva de arquivo do
 * sistema operacional (`flag: "wx"`), que só uma das duas chamadas
 * concorrentes pode vencer — a garantia de atomicidade vem do SO, não do
 * código do Node.
 */
const DIR = join(process.cwd(), ".data", "idempotency");
const TTL_MS = 15 * 60 * 1000;

function pathFor(key: string): string {
  const safe = key.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120);
  return join(DIR, `${safe}.json`);
}

/**
 * Tenta reivindicar a chave para `orderId`. Se ninguém reivindicou ainda,
 * esta chamada "vence" e `owner` vem `true`. Se outra requisição já
 * reivindicou (mesmo que há poucos milissegundos), retorna `owner: false`
 * com o `orderId` que venceu, para o chamador reaproveitar o mesmo pedido.
 */
export function claimIdempotency(key: string, orderId: string): { owner: boolean; orderId: string } {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
  const path = pathFor(key);

  try {
    writeFileSync(path, JSON.stringify({ orderId, at: Date.now() }), { flag: "wx" });
    return { owner: true, orderId };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EEXIST") {
      try {
        const stat = statSync(path);
        if (Date.now() - stat.mtimeMs > TTL_MS) {
          // reivindicação antiga expirada: esta chamada assume a chave.
          writeFileSync(path, JSON.stringify({ orderId, at: Date.now() }), { flag: "w" });
          return { owner: true, orderId };
        }
        const existing = JSON.parse(readFileSync(path, "utf-8")) as { orderId: string };
        return { owner: false, orderId: existing.orderId };
      } catch {
        return { owner: true, orderId };
      }
    }
    throw err;
  }
}
