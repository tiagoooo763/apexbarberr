import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { SITE, NAV_ITEMS } from "@/config/site";
import { isDemo } from "@/config/env";
import { getProfessionals, getProducts } from "@/lib/data";
import { REVIEWS } from "@/data/reviews";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { RevealObserver } from "@/components/layout/RevealObserver";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["barbearia", "barbeiro", "corte de cabelo", "barba", "agendamento online", SITE.name],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0c",
};

function StructuredData() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: SITE.name,
    slogan: SITE.tagline,
    url: SITE.url,
    image: `${SITE.url}/og.jpg`,
    sameAs: [SITE.social.instagram.url],
  };
  if (SITE.address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: `${SITE.address.street}${SITE.address.number ? `, ${SITE.address.number}` : ""}`,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: "BR",
    };
  }
  if (SITE.contact.phone) data.telephone = SITE.contact.phone;
  if (SITE.hours) {
    data.openingHoursSpecification = SITE.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map(
        (d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d],
      ),
      opens: h.open,
      closes: h.close,
    }));
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasTeam = getProfessionals().length > 0;
  const hasProducts = getProducts().length > 0;
  const hasReviews = REVIEWS.length > 0;

  const navLinks = NAV_ITEMS.filter((item) => {
    if (item.section === "team") return hasTeam;
    if (item.section === "products") return hasProducts;
    if (item.section === "reviews") return hasReviews;
    return true;
  });

  return (
    <html lang="pt-BR">
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {isDemo && <DemoBanner />}
        <Header navLinks={navLinks} />
        <main id="conteudo">{children}</main>
        <Footer navLinks={navLinks} />
        <RevealObserver />
        <StructuredData />
      </body>
    </html>
  );
}
