import Link from "next/link";
import { Brand } from "@/components/Brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand />
        <nav aria-label="Site navigation">
          <Link href="/">Search</Link>
          <Link href="/places/india">Places</Link>
          <Link href="/directory">Directory</Link>
        </nav>
      </div>
    </header>
  );
}
