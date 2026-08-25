"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Les deux icones sont rendues, le CSS en cache une. Le theme n'etant connu
  // qu'apres l'hydratation, choisir l'icone en JavaScript imposait un etat
  // `mounted` et un effet — donc un carre vide au premier rendu, et un
  // avertissement du linter React. Laisser la classe `dark` trancher supprime
  // les deux.
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Basculer le thème"
    >
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 dark:hidden" />
    </Button>
  );
}
