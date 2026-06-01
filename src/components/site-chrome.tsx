import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { isAdmin, user } = useAuth();

  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm uppercase tracking-[0.15em] transition-colors hover:text-primary ${
        path === to ? "text-primary" : "text-foreground/80"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Mochiato<span className="text-primary">.</span>
        </Link>
        <nav className="flex items-center gap-6">
          {link("/", "Home")}
          {link("/menu", "Menu")}
          {link("/reservations", "Tables")}
          {isAdmin && link("/admin", "Admin")}
          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm uppercase tracking-[0.15em] text-foreground/60 hover:text-primary"
            >
              Sign out
            </button>
          ) : (
            link("/login", "Login")
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl">Mochiato<span className="text-primary">.</span></h3>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Where craft coffee meets handmade mochi. A small cafe with a big heart in Gampaha.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg">Visit</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            142 Bauddhaloka Mawatha<br />
            Gampaha, Sri Lanka
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg">Hours</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Mon–Fri: 8:00 – 22:00<br />
            Sat–Sun: 9:00 – 23:00
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 px-5 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Mochiato Gampaha. All rights reserved.
      </div>
    </footer>
  );
}
