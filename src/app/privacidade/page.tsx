import type { Metadata } from "next";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: `Como a ${SITE.name} trata os dados informados no agendamento online.`,
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: "42rem" }}>
        <div className="section-head">
          <p className="section-kicker">Transparência</p>
          <h1 className="section-title">Política de privacidade</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", color: "var(--ink-text-dim)", lineHeight: "var(--leading-relaxed)" }}>
          <p>
            Esta página explica, em linguagem simples, o que acontece com as informações que você
            preenche ao agendar um horário pelo site da {SITE.name}.
          </p>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)", marginBottom: "var(--space-2)", color: "var(--ink-text)" }}>
              O que coletamos
            </h2>
            <p>
              Ao agendar, pedimos seu nome, telefone e (quando aplicável) e-mail — apenas para
              identificar e confirmar o seu horário. Não pedimos dados de cartão de pagamento
              diretamente: quando um provedor de pagamento estiver conectado, o processamento do
              pagamento acontece nos sistemas desse provedor, não neste site.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)", marginBottom: "var(--space-2)", color: "var(--ink-text)" }}>
              Como usamos
            </h2>
            <p>
              Usamos essas informações somente para organizar a agenda da barbearia e, se você
              informar e-mail, para enviar a confirmação do seu horário. Não vendemos nem
              compartilhamos seus dados com terceiros para fins de marketing.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)", marginBottom: "var(--space-2)", color: "var(--ink-text)" }}>
              Contato
            </h2>
            <p>
              Para dúvidas sobre seus dados, fale com a {SITE.name} pelo Instagram{" "}
              <a href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-bright)" }}>
                @{SITE.social.instagram.handle}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
