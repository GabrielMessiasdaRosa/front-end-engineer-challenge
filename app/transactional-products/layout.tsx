import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos Transacionais",
  description: "Página de produtos transacionais",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="max-h-screen max-w-screen overflow-x-hidden p-8">
      {children}
    </main>
  );
}
