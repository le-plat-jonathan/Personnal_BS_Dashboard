"use client";

import { useState } from "react";
import Image from "next/image";
import { getBrawlerImageUrl } from "@/lib/brawlify";
import type { Brawler } from "@/types/brawlstars";
import type { BrawlifyBrawler } from "@/types/brawlify";

interface Props {
  brawlers: Brawler[];
  brawlifyData: Record<number, BrawlifyBrawler>;
}

type Filter = "all" | "hypercharge" | string;
type SortKey = "trophies_desc" | "trophies_asc" | "name" | "power";

function rankColor(rank: number): string {
  if (rank >= 35) return "#ff6fcf";
  if (rank >= 25) return "#c77dff";
  if (rank >= 20) return "#9d4edd";
  if (rank >= 15) return "#4361ee";
  if (rank >= 10) return "#f9c74f";
  return "#adb5bd";
}

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

  const classes = Array.from(
    new Set(
      brawlers
        .map((b) => brawlifyData[b.id]?.class.name)
        .filter((c): c is string => Boolean(c) && c !== "Unknown")
    )
  ).sort();

  const hyperchargeCount = brawlers.filter((b) => b.hyperCharge != null).length;

  const sorted = [...brawlers].sort((a, b) => {
    switch (sort) {
      case "trophies_asc": return a.trophies - b.trophies;
      case "name": return a.name.localeCompare(b.name);
      case "power": return b.power - a.power;
      default: return b.trophies - a.trophies;
    }
  });

  const filtered = sorted.filter((b) => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "hypercharge") return b.hyperCharge != null;
    if (filter !== "all") return brawlifyData[b.id]?.class.name === filter;
    return true;
  });

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 space-y-3">
        <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
          🎮 Les bagarreurs{" "}
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
          const totalSP = meta?.starPowers.length ?? 2;
          const totalGadgets = meta?.gadgets.length ?? 2;

          return (
            <div
              key={b.id}
              className="rounded-lg border border-border bg-muted/60 p-3 flex flex-col items-center gap-2 hover:bg-muted/80 transition-colors"
            >
              {/* Image + hypercharge badge */}
              <div className="relative w-16 h-16 shrink-0">
                <Image
                  src={meta?.imageUrl ?? getBrawlerImageUrl(b.id)}
                  alt={b.name}
                  fill
                  className="object-contain drop-shadow-md"
                  unoptimized
                />
                {b.hyperCharge && (
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-400 border-2 border-card"
                    title={`Hypercharge : ${b.hyperCharge.name}`}
                  />
                )}
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

              {/* Trophies + rank */}
              <div className="w-full flex justify-between items-center text-xs">
                <span className="font-bold text-yellow-400">
                  🏆 {b.trophies.toLocaleString()}
                </span>
                <span
                  className="font-bold rounded-full w-6 h-6 flex items-center justify-center text-white text-[10px]"
                  style={{ backgroundColor: rankColor(b.rank) }}
                  title={`Rang ${b.rank}`}
                >
                  {b.rank}
                </span>
              </div>

              {/* Power bar */}
              <PowerBar power={b.power} />

              {/* Star Powers + Gadgets */}
              <div className="w-full flex justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>SP</span>
                  <Dots
                    unlocked={b.starPowers.length}
                    total={totalSP}
                    color="#f9c74f"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span>Gad</span>
                  <Dots
                    unlocked={b.gadgets.length}
                    total={totalGadgets}
                    color="#90e0ef"
                  />
                </div>
              </div>

              {/* Gears */}
              {b.gears.length > 0 && (
                <div className="w-full flex flex-wrap gap-1 justify-center">
                  {b.gears.map((g) => (
                    <span
                      key={g.name}
                      className="text-[9px] bg-background px-1.5 py-0.5 rounded border border-border text-foreground"
                      title={`${g.name} niv.${g.level}`}
                    >
                      {g.name} {g.level}
                    </span>
                  ))}
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

function Dots({
  unlocked,
  total,
  color,
}: {
  unlocked: number;
  total: number;
  color: string;
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: i < unlocked ? color : "var(--muted-foreground)" }}
          title={i < unlocked ? "Débloqué" : "Manquant"}
        />
      ))}
    </div>
  );
}

function PowerBar({ power }: { power: number }) {
  return (
    <div className="w-full flex items-center gap-1">
      <span className="text-[10px] text-muted-foreground shrink-0">P{power}</span>
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
