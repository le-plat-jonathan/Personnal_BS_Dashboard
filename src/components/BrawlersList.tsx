"use client";

import { useState } from "react";
import Image from "next/image";
import { getBrawlerImageUrl } from "@/lib/brawlify";
import type { Brawler } from "@/types/brawlstars";
import type { BrawlifyBrawler, BrawlifyAbility } from "@/types/brawlify";
import BrawlerModal from "@/components/BrawlerModal";

interface Props {
  brawlers: Brawler[];
  brawlifyData: Record<number, BrawlifyBrawler>;
}

type Filter = "all" | "hypercharge" | string;
type SortKey = "trophies_desc" | "trophies_asc" | "name" | "power";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "trophies_desc", label: "🏆 Max" },
  { value: "trophies_asc", label: "🏆 Min" },
  { value: "name", label: "A–Z" },
  { value: "power", label: "Niveau" },
];

export default function BrawlersList({ brawlers, brawlifyData }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("trophies_desc");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Brawler | null>(null);

  const classes = Array.from(
    new Set(
      brawlers
        .map((b) => brawlifyData[b.id]?.class.name)
        .filter((c): c is string => Boolean(c) && c !== "Unknown")
    )
  ).sort();

  const hyperchargeCount = brawlers.filter((b) => b.hyperCharges && b.hyperCharges.length > 0).length;

  const sorted = [...brawlers].sort((a, b) => {
    switch (sort) {
      case "trophies_asc": return a.trophies - b.trophies;
      case "name": return a.name.localeCompare(b.name);
      // Decroissant, puis departage par trophees. Sans ce second critere les
      // dizaines de brawlers a puissance egale (11 est le plafond) se suivent
      // dans l'ordre de l'API, et la liste donne l'impression de n'etre pas
      // triee du tout.
      case "power": return b.power - a.power || b.trophies - a.trophies;
      default: return b.trophies - a.trophies;
    }
  });

  const filtered = sorted.filter((b) => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "hypercharge") return b.hyperCharges != null && b.hyperCharges.length > 0;
    if (filter !== "all") return brawlifyData[b.id]?.class.name === filter;
    return true;
  });

  return (
    <>
    {selected && (
      <BrawlerModal
        brawler={selected}
        meta={brawlifyData[selected.id]}
        onClose={() => setSelected(null)}
      />
    )}
    <section className="glass p-6">
      <div className="mb-4 space-y-3">
        <h2 className="font-display text-xs font-extrabold tracking-[0.18em] text-muted-foreground uppercase flex items-center gap-2">
          Brawlers{" "}
          <span className="text-foreground">{brawlers.length}</span>
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
            Tous ({brawlers.length})
          </FilterBtn>
          {hyperchargeCount > 0 && (
            <FilterBtn
              active={filter === "hypercharge"}
              onClick={() => setFilter("hypercharge")}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-violet-400 mr-1" />
              Hypercharge ({hyperchargeCount})
            </FilterBtn>
          )}
          {classes.map((cls) => (
            <FilterBtn
              key={cls}
              active={filter === cls}
              onClick={() => setFilter(cls)}
            >
              {cls}
            </FilterBtn>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Rechercher un brawler…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Trier</span>
          <div className="flex flex-wrap gap-1.5">
            {SORT_OPTIONS.map((opt) => (
              <FilterBtn
                key={opt.value}
                active={sort === opt.value}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </FilterBtn>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((b) => {
          const meta = brawlifyData[b.id];
          const rarityColor = meta?.rarity.color ?? "#888";
          const hasHypercharge = Boolean(b.hyperCharges && b.hyperCharges.length > 0);

          return (
            <div
              key={b.id}
              className="glass-inset p-3 flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
              onClick={() => setSelected(b)}
            >
              {/* L'hypercharge est signalee par la couleur de la pastille de
                  niveau, plus bas : inutile de la repeter sur l'illustration. */}
              <div className="relative w-16 h-16 shrink-0">
                <Image
                  src={meta?.imageUrl ?? getBrawlerImageUrl(b.id)}
                  alt={b.name}
                  fill
                  className="object-contain drop-shadow-md"
                  unoptimized
                />
              </div>

              {/* Name + rarity + class */}
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-wide leading-tight">
                  {b.name}
                </div>
                {meta && (
                  <div className="text-[10px] mt-0.5 flex items-center gap-1 justify-center flex-wrap">
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

              {/* Trophies + niveau de puissance */}
              <div className="w-full flex justify-between items-center text-xs">
                <span className="font-display tabular font-extrabold text-amber-600 dark:text-amber-300">
                  🏆 {b.trophies.toLocaleString()}
                </span>
                <span
                  className={`font-display tabular font-extrabold rounded-full w-6 h-6 flex items-center justify-center text-white text-[10px] ${
                    hasHypercharge ? "bg-violet-500" : "bg-amber-500"
                  }`}
                  title={`Niveau ${b.power}${hasHypercharge ? ` · Hypercharge : ${b.hyperCharges?.[0]?.name ?? "débloquée"}` : ""}`}
                >
                  {b.power}
                </span>
              </div>

              {/* Power bar */}
              <PowerBar power={b.power} />

              {/* Star Powers + Gadgets */}
              {meta && (
                <div className="w-full flex justify-between items-center">
                  <AbilityIcons
                    available={meta.starPowers}
                    unlockedIds={b.starPowers.map((s) => s.id)}
                    label="SP"
                  />
                  <AbilityIcons
                    available={meta.gadgets}
                    unlockedIds={b.gadgets.map((g) => g.id)}
                    label="Gad"
                  />
                </div>
              )}

            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-8">
          Aucun brawler pour ce filtre.
        </p>
      )}
    </section>
    </>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function AbilityIcons({
  available,
  unlockedIds,
  label,
}: {
  available: BrawlifyAbility[];
  unlockedIds: number[];
  label: string;
}) {
  if (available.length === 0) return null;
  return (
    <div className="w-full flex items-center gap-1">
      <span className="text-[9px] text-muted-foreground w-5 shrink-0">{label}</span>
      <div className="flex gap-1">
        {available.map((ability) => {
          const unlocked = unlockedIds.includes(ability.id);
          return (
            <div
              key={ability.id}
              className="relative w-5 h-5"
              title={unlocked ? ability.name : `${ability.name} (manquant)`}
            >
              <Image
                src={ability.imageUrl}
                alt={ability.name}
                fill
                className={`object-contain ${unlocked ? "" : "grayscale opacity-30"}`}
                unoptimized
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PowerBar({ power }: { power: number }) {
  return (
    <div className="w-full flex items-center gap-1">
      <div className="flex-1 flex gap-px">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-sm ${
              i < power
                ? power >= 11
                  ? "bg-violet-400"
                  : power >= 9
                  ? "bg-blue-400"
                  : "bg-green-400"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
