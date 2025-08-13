"use client";

import { usePathname } from "next/navigation";
import BotaoDoacao from "./botao-doacao/BotaoDoacao";

export default function DonationButtonWrapper() {
  const pathname = usePathname() ?? "";
  
  const isDonationPage =
    pathname === "/pages/como-ajudar" || pathname.startsWith("/pages/como-ajudar/");
  
  if (isDonationPage) {
    return null;
  }

  return <BotaoDoacao />;
}