import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="space-y-6 flex flex-col items-center">
        <Image
          src="/logo-shipayLogoshipay.svg"
          alt="Logo"
          width={300}
          height={300}
        />{" "}
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Desafio Front End Engineer - Shipay
        </h1>
        <Link href="/transactional-products" className="text-white">
          <Button
            color="primary"
            radius="full"
            className="animate-bounce transition-all duration-500 hover:scale-110"
            size="lg"
          >
            Entrar
          </Button>
        </Link>
      </div>
    </main>
  );
}
