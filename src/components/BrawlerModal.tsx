"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Zap } from "lucide-react";
import { getBrawlerImageUrl } from "@/lib/brawlify";
import { buildLoadout, iconUrl, type LoadoutItem } from "@/lib/loadout";
import type { Brawler, CatalogueBrawler } from "@/types/brawlstars";
import type { BrawlifyBrawler } from "@/types/brawlify";

interface Props {
  brawler: Brawler;
  meta: BrawlifyBrawler | undefined;
  catalogue: CatalogueBrawler | undefined;
  onClose: () => void;
}

export default function BrawlerModal({ brawler, meta, catalogue, onClose }: Props) {
  // Fermer avec Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const rarityColor = meta?.rarity.color ?? "#888";
  const loadout = buildLoadout(brawler, catalogue);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-5 p-6 border-b border-border">
          <div className="relative w-24 h-24 shrink-0">
            <Image
              src={meta?.imageUrl ?? getBrawlerImageUrl(brawler.id)}
              alt={brawler.name}
              fill
              className="object-contain drop-shadow-xl"
              unoptimized
            />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold uppercase tracking-wide">
              {brawler.name}
            </h2>
            {meta && (
              <div className="flex items-center gap-2 mt-1 text-sm flex-wrap">
                <span style={{ color: rarityColor }}>{meta.rarity.name}</span>
                {meta.class.name !== "Unknown" && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{meta.class.name}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatBlock label="Trophées" value={`🏆 ${brawler.trophies.toLocaleString()}`} />
            <StatBlock label="Puissance" value={`P${brawler.power}`} />
            {brawler.currentWinStreak != null && (
              <StatBlock label="Série actuelle" value={`${brawler.currentWinStreak}`} />
            )}
            {brawler.maxWinStreak != null && (
              <StatBlock label="Meilleure série" value={`${brawler.maxWinStreak}`} />
            )}
          </div>

          <LoadoutGrid title="Star Powers" items={loadout.starPowers} icon={iconUrl.starPower} />
          <LoadoutGrid title="Gadgets" items={loadout.gadgets} icon={iconUrl.gadget} />
          <LoadoutGrid title="Équipements" items={loadout.gears} icon={iconUrl.gear} />
          {/* `icon` a null : le CDN Brawlify ne publie aucune image pour les
              hypercharges, contrairement aux trois autres familles. Verifie le
              2026-08-25, une vingtaine de chemins essayes. La vignette se rabat
              sur un pictogramme d'eclair. */}
          <LoadoutGrid title="Hypercharge" items={loadout.hyperCharges} icon={null} />
        </div>
      </div>
    </div>,
    document.body
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-inset px-3 py-2">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className="font-display tabular text-sm font-bold">{value}</div>
    </div>
  );
}

/**
 * Une grille d'objets : ceux que le joueur possede en couleur, ceux qui lui
 * manquent en gris et estompes.
 *
 * Meme rendu pour les quatre familles, c'est ce qui permet de comparer d'un
 * coup d'oeil ce qui reste a debloquer sur un brawler.
 */
function LoadoutGrid({
  title,
  items,
  icon,
}: {
  title: string;
  items: LoadoutItem[];
  icon: ((id: number) => string) | null;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-xs font-extrabold tracking-[0.18em] text-muted-foreground uppercase mb-3">
        {title}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`glass-inset flex flex-col items-center gap-1 p-2 text-center ${
              item.owned ? "" : "opacity-40"
            }`}
            title={item.owned ? item.name : `${item.name} · pas encore débloqué`}
          >
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
              {icon ? (
                <Image
                  src={icon(item.id)}
                  alt={item.name}
                  fill
                  className={`object-contain ${item.owned ? "" : "grayscale"}`}
                  unoptimized
                />
              ) : (
                // Repli des hypercharges : le CDN n'en publie aucune image,
                // contrairement aux trois autres familles.
                <Zap
                  className={`w-7 h-7 ${
                    item.owned
                      ? "text-violet-400 fill-violet-400/30"
                      : "text-muted-foreground"
                  }`}
                />
              )}
            </div>
            <span className="text-[10px] leading-tight uppercase">{item.name}</span>
            {item.level != null && (
              <span className="font-display tabular text-[10px] font-bold text-amber-300">
                N{item.level}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
