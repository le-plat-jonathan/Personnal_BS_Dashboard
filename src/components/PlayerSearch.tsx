"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { isPlausibleTag, normalizeTag } from "@/lib/players";

export default function PlayerSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isPlausibleTag(value)) {
      setError("Un tag ressemble à #Q9YV28JVC. Le # est facultatif.");
      return;
    }
    // Le `#` ne part PAS dans l'URL : dans une query string il ouvrirait le
    // fragment et le tag serait tronque. La page le remet a la lecture.
    const tag = normalizeTag(value).slice(1);
    setOpen(false);
    setValue("");
    setError(null);
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher un joueur par son tag"
        className="glass-inset w-9 h-9 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Search className="w-4 h-4" />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[18vh] bg-background/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <form
              onSubmit={submit}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="recherche-titre"
              className="glass-modal w-full max-w-md p-6 space-y-4"
            >
              <div>
                <h2
                  id="recherche-titre"
                  className="font-display text-lg font-extrabold tracking-tight"
                >
                  Rechercher un joueur
                </h2>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder="Ne pas entrer le #"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={error ? true : undefined}
                className="glass-inset w-full px-3 py-2 font-mono uppercase tracking-wider text-foreground placeholder:text-muted-foreground placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-ring"
              />

              {error && (
                <p role="alert" className="text-sm text-rose-300">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="glass-inset px-4 py-2 text-sm font-display font-bold hover:-translate-y-0.5 transition-transform"
                >
                  Afficher
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}
    </>
  );
}
