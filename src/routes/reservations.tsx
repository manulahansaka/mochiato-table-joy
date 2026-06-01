import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTables, getSettings, getOccupiedHours } from "@/lib/api/cafe.functions";

const tablesQuery = queryOptions({ queryKey: ["tables"], queryFn: () => getTables() });
const settingsQuery = queryOptions({ queryKey: ["settings"], queryFn: () => getSettings() });

const todayISO = () => new Date().toISOString().slice(0, 10);

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Tables & Reservations — Mochiato Gampaha" },
      { name: "description", content: "See available study tables and reserved hours. Call us to book your slot." },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(tablesQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]),
  component: ReservationsPage,
  errorComponent: ({ error }) => <div className="p-10 text-center">Could not load: {error.message}</div>,
});

function ReservationsPage() {
  const tables = useSuspenseQuery(tablesQuery).data;
  const settings = useSuspenseQuery(settingsQuery).data;
  const [date, setDate] = useState(todayISO());

  const occupiedQuery = useSuspenseQuery(
    queryOptions({
      queryKey: ["occupied", date],
      queryFn: () => getOccupiedHours({ data: { date } }),
    }),
  );

  const open = parseInt(settings.opening_hour ?? "8", 10);
  const close = parseInt(settings.closing_hour ?? "22", 10);
  const hours = Array.from({ length: close - open }, (_, i) => open + i);
  const rate = settings.hourly_rate_lkr ?? "1500";
  const phone = settings.restaurant_phone ?? "";

  const isOccupied = (tableId: string, hour: number) =>
    occupiedQuery.data.some((o) => o.table_id === tableId && o.hour === hour);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">Study tables</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Reserve by the hour.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Tables are <span className="font-semibold text-foreground">Rs. {Number(rate).toLocaleString()} / hour</span>.
          Check availability below, then call us to book your slot.
        </p>
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105"
          >
            📞 Call {phone}
          </a>
        )}
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-3">
          <span className="text-sm uppercase tracking-wider text-muted-foreground">Date</span>
          <input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-input bg-card px-3 py-2 text-sm"
          />
        </label>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-secondary" /> Free</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary" /> Reserved</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="sticky left-0 z-10 bg-secondary/50 p-3 text-left font-display text-base">Table</th>
              {hours.map((h) => (
                <th key={h} className="p-2 text-center font-mono text-xs text-muted-foreground">
                  {String(h).padStart(2, "0")}:00
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tables.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <th className="sticky left-0 z-10 bg-card p-3 text-left">
                  <div className="font-display text-base">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.seats} seats</div>
                </th>
                {hours.map((h) => {
                  const taken = isOccupied(t.id, h);
                  return (
                    <td key={h} className="p-1.5">
                      <div
                        className={`h-9 rounded-md transition ${
                          taken ? "bg-primary" : "bg-secondary hover:bg-secondary/70"
                        }`}
                        title={taken ? "Reserved" : "Available"}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Online self-booking isn't available yet — please call to reserve.
      </p>
    </div>
  );
}
