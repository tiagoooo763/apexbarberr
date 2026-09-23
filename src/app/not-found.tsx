import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--space-5)" }}>
        <p className="section-kicker">Erro 404</p>
        <h1 className="section-title">Esta página não existe</h1>
        <p className="section-lede" style={{ textAlign: "center" }}>
          O endereço que você tentou acessar não foi encontrado. Volte para a página inicial da Apex
          Barber ou agende seu horário.
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" className="btn btn-gold">
            Página inicial
          </Link>
          <Link href="/agendar" className="btn btn-outline">
            Agendar horário
          </Link>
        </div>
      </div>
    </section>
  );
}
