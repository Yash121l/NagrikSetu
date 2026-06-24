import Image from "next/image";
import Link from "next/link";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={inverse ? "brand brand--inverse" : "brand"} href="/" aria-label="NagrikSetu home">
      <Image alt="NagrikSetu" height={44} priority src="/nagriksetu-logo.svg" width={196} />
    </Link>
  );
}
