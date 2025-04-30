"use client"; 

import { usePathname } from "next/navigation";
import NavBar from "@/app/components/NavBar";

export function NavBarWrapper() {
  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/dashboard");

  if (hideNavbar) return null;

  return <NavBar />;
}
