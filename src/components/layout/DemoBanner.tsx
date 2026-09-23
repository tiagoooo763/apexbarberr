import { SparkleIcon } from "@/components/ui/Icon";
import styles from "./DemoBanner.module.css";

/**
 * Faixa honesta e permanente enquanto o site estiver em modo demonstração:
 * deixa claro que serviços, preços, equipe e produtos exibidos são
 * fictícios — nada aqui é apresentado como informação real da Apex Barber.
 */
export function DemoBanner() {
  return (
    <div className={styles.bar}>
      <p className={`wrap ${styles.inner}`}>
        <SparkleIcon size={14} />
        Modo demonstração: serviços, preços e equipe mostrados abaixo são fictícios, só para exibir o
        funcionamento do site. Substitua pelos dados reais em <code>src/data</code> antes de publicar.
      </p>
    </div>
  );
}
