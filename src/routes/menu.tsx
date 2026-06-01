import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getMenu } from "@/lib/api/cafe.functions";

const menuQuery = queryOptions({ queryKey: ["menu"], queryFn: () => getMenu() });

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Mochiato Gampaha" },
      { name: "description", content: "Browse our coffee, mochi, and specials, with prices in Sri Lankan rupees." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(menuQuery),
  component: MenuPage,
  errorComponent: ({ error }) => <div className="p-10 text-center">Could not load menu: {error.message}</div>,
});

function MenuPage() {
  const { data } = useSuspenseQuery(menuQuery);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <header className="mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">Our menu</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Slow brewed, hand made.</h1>
      </header>

      {data.categories.map((cat) => {
        const items = data.items.filter((i) => i.category_id === cat.id);
        if (!items.length) return null;
        return (
          <section key={cat.id} className="mb-16">
            <h2 className="mb-8 font-display text-3xl md:text-4xl">{cat.name}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className={`group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg ${
                    !item.is_available ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl">{item.name}</h3>
                    <span className="whitespace-nowrap font-display text-lg text-primary">
                      Rs. {Number(item.price_lkr).toLocaleString()}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  )}
                  {!item.is_available && (
                    <p className="mt-3 text-xs uppercase tracking-wider text-destructive">Currently unavailable</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
