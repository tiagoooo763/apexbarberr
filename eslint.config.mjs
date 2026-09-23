import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "node_modules/**", "playwright-report/**", "test-results/**"] },
  ...nextCoreWebVitals,
  {
    rules: {
      // Sinaliza até o fetch-on-dependency-change padrão e documentado pelo
      // próprio React (ver "Fetching data" em react.dev/learn/synchronizing-with-effects).
      // Usado aqui exatamente nesse padrão (buscar horários quando serviço/
      // profissional/data mudam), então mantemos como aviso, não erro de build.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
