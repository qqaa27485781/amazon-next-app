import { ReactNode } from "react";
import { getLandingPage } from "@/services/page";

export default async function DefaultLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const page = await getLandingPage(locale);

  return (
    <>
      <main className="overflow-x-hidden">{children}</main>
    </>
  );
}
