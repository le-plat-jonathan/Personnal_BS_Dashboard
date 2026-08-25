import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Reservee aux titres, au pseudo et aux gros compteurs. Geist reste la police
// du texte courant : Bricolage a trop de caractere pour de la lecture longue,
// c'est justement ce qui la rend utile en affichage.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brawl Stars Dashboard",
  description: "Dashboard familial Brawl Stars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `dark` en dur : le dashboard n'a plus qu'un theme. La classe reste
    // indispensable, une trentaine de variantes `dark:` dans les composants en
    // dependent. Plus de next-themes, donc plus de `suppressHydrationWarning`
    // ni de bascule de classe apres l'hydratation.
    <html
      lang="fr"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {/* Le decor que le verre floute. Purement visuel, donc masque aux
            lecteurs d'ecran. */}
        <div aria-hidden className="aurora" />
        {children}
      </body>
    </html>
  );
}
