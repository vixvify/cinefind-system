import type { ReactNode } from "react";
import { Footer, Header } from "./shell";

export function PageShell({ children }: { children: ReactNode }) {
  return <><Header /><main className="page">{children}<Footer /></main></>;
}
