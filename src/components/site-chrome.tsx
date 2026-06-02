import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { isAdmin, user } = useAuth();
  const [open, setOpen] = useState(false);

  const linkClass = (to: string) =>
    `text-sm uppercase tracking-[0.15em] transition-colors hover:text-primary ${
      path === to ? "text-primary" : "text-foreground/80"
    }`;

  const navItems = (
    <>
      <Link to="/" onClick={() => setOpen(false)} className={linkClass("/")}>
        Home
      </Link>
      <Link to="/menu" onClick={() => setOpen(false)} className={linkClass("/menu")}>
        Menu
      </Link>
      <Link to="/reservations" onClick={() => setOpen(false)} className={linkClass("/reservations")}>
        Tables
      </Link>
      {isAdmin && (
        <Link to="/admin" onClick={() => setOpen(false)} className={linkClass("/admin")}>
          Admin
        </Link>
      )}
      {user ? (
        <button
          onClick={() => {
            setOpen(false);
            supabase.auth.signOut();
          }}
          className="text-left text-sm uppercase tracking-[0.15em] text-foreground/60 hover:text-primary"
        >
          Sign out
        </button>
      ) : (
        <Link to="/login" onClick={() => setOpen(false)} className={linkClass("/login")}>
          Login
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-5">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Mochiato<span className="text-primary">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">{navItems}</nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="rounded-md p-2 text-foreground/80 hover:bg-secondary md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border/60 bg-background/95 px-5 py-5 md:hidden">
          {navItems}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-secondary/40 sm:mt-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-10 sm:px-5 sm:py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl">
            Mochiato<span className="text-primary">.</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Where craft coffee meets comfort food. A small cafe with a big heart in Gampaha.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg">Visit</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            142 Bauddhaloka Mawatha
            <br />
            Gampaha, Sri Lanka
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg">Hours</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Mon–Fri: 8:00 – 22:00
            <br />
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
