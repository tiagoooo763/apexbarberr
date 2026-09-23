import { getProducts } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import styles from "./Products.module.css";

export function Products() {
  const products = getProducts();
  if (products.length === 0) return null;

  return (
    <section id="produtos" className="section" aria-labelledby="products-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="section-kicker">Para continuar em casa</p>
          <h2 id="products-title" className="section-title">
            Produtos
          </h2>
        </div>

        <ul className={`${styles.grid} reveal`}>
          {products.map((p) => (
            <li key={p.id} className={styles.card}>
              {p.image && (
                <div className={styles.photo}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image.src} alt={p.image.alt} loading="lazy" />
                </div>
              )}
              <span className={styles.name}>{p.name}</span>
              {p.description && <p className={styles.desc}>{p.description}</p>}
              <div className={styles.foot}>
                <span className={styles.price}>{formatBRL(p.priceCents)}</span>
                {p.buyUrl && (
                  <a href={p.buyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    Comprar
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
