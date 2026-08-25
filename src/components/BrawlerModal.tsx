"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getBrawlerImageUrl } from "@/lib/brawlify";
import type { Brawler } from "@/types/brawlstars";
import type { BrawlifyBrawler, BrawlifyAbility } from "@/types/brawlify";

interface Props {
  brawler: Brawler;
  meta: BrawlifyBrawler | undefined;
  onClose: () => void;
}

export default function BrawlerModal({ brawler, meta, onClose }: Props) {
  // Fermer avec Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const rarityColor = meta?.rarity.color ?? "#888";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
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
            <h2 className="text-xl font-black uppercase tracking-wide">{brawler.name}</h2>
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
            {brawler.hyperCharges && brawler.hyperCharges.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block" />
                <span className="text-xs text-violet-400 font-medium">
                  Hypercharge : {brawler.hyperCharges[0].name}
                </span>
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

          {/* Star Powers */}
          {meta && meta.starPowers.length > 0 && (
            <AbilitySection
              title="Star Powers"
              abilities={meta.starPowers}
              unlockedIds={brawler.starPowers.map((s) => s.id)}
            />
          )}

          {/* Gadgets */}
          {meta && meta.gadgets.length > 0 && (
            <AbilitySection
              title="Gadgets"
              abilities={meta.gadgets}
              unlockedIds={brawler.gadgets.map((g) => g.id)}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function StatBlock({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="glass-inset px-3 py-2">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className="text-sm font-bold" style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  );
}

function AbilitySection({
  title,
  abilities,
  unlockedIds,
}: {
  title: string;
  abilities: BrawlifyAbility[];
  unlockedIds: number[];
}) {
  return (
    <div>
      <h3 className="font-display text-xs font-extrabold tracking-[0.18em] text-muted-foreground uppercase mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        {abilities.map((ability) => {
          const unlocked = unlockedIds.includes(ability.id);
          return (
            <div
              key={ability.id}
              className={`flex items-start gap-3 rounded-lg p-3 border ${
                unlocked
                  ? "border-border bg-muted/40"
                  : "border-border/40 bg-muted/20 opacity-50"
              }`}
            >
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src={ability.imageUrl}
                  alt={ability.name}
                  fill
                  className={`object-contain ${unlocked ? "" : "grayscale"}`}
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2">
                  {ability.name}
                  {!unlocked && (
                    <span className="text-[10px] text-muted-foreground font-normal">
                      (manquant)
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {ability.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
