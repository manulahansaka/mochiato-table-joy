import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  getMenu, getTables, getSettings,
  upsertCategory, deleteCategory,
  upsertMenuItem, deleteMenuItem,
  upsertTable, deleteTable,
  updateSetting,
  listReservations, createReservation, deleteReservation,
} from "@/lib/api/cafe.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Mochiato" }] }),
  component: AdminPage,
});

const today = () => new Date().toISOString().slice(0, 10);

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"menu" | "tables" | "reservations" | "settings">("menu");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) return <div className="p-20 text-center text-muted-foreground">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl">Access pending</h1>
        <p className="mt-3 text-muted-foreground">
          Your account ({user.email}) is signed in but does not yet have admin access.
          Ask an existing admin to grant your account the admin role.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">User ID: {user.id}</p>
        <Link to="/" className="mt-6 inline-block text-primary underline">← Back home</Link>
      </div>
    );
  }

  const refreshAll = () => {
    qc.invalidateQueries();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl">Admin</h1>
      <div className="mt-6 flex gap-2 border-b border-border">
        {(["menu", "tables", "reservations", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm uppercase tracking-wider transition ${
              tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {tab === "menu" && <MenuAdmin onChange={refreshAll} />}
        {tab === "tables" && <TablesAdmin onChange={refreshAll} />}
        {tab === "reservations" && <ReservationsAdmin onChange={refreshAll} />}
        {tab === "settings" && <SettingsAdmin onChange={refreshAll} />}
      </div>
    </div>
  );
}

/* ---------- Menu admin ---------- */
function MenuAdmin({ onChange }: { onChange: () => void }) {
  const menu = useQuery({ queryKey: ["menu"], queryFn: () => getMenu() });
  const [newCat, setNewCat] = useState("");

  if (!menu.data) return <p>Loading…</p>;

  const addCat = async () => {
    if (!newCat.trim()) return;
    try {
      await upsertCategory({ data: { name: newCat.trim(), sort_order: menu.data.categories.length + 1 } });
      setNewCat("");
      onChange();
      toast.success("Category added");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl">Categories</h2>
        <div className="mt-3 flex gap-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category"
            className="flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm"
          />
          <button onClick={addCat} className="rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90">Add</button>
        </div>
        <ul className="mt-3 space-y-1">
          {menu.data.categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm">
              <span>{c.name}</span>
              <button
                onClick={async () => {
                  if (!confirm(`Delete category "${c.name}" and all its items?`)) return;
                  try { await deleteCategory({ data: { id: c.id } }); onChange(); }
                  catch (e: any) { toast.error(e.message); }
                }}
                className="text-xs text-destructive hover:underline"
              >Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl">Items</h2>
        <ItemForm categories={menu.data.categories} onSaved={onChange} />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {menu.data.items.map((i) => (
            <div key={i.id} className="rounded-md border border-border bg-card p-3">
              <ItemForm
                categories={menu.data!.categories}
                existing={i}
                onSaved={onChange}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ItemForm({
  categories, existing, onSaved,
}: {
  categories: { id: string; name: string }[];
  existing?: any;
  onSaved: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [price, setPrice] = useState(existing?.price_lkr ?? 500);
  const [catId, setCatId] = useState(existing?.category_id ?? categories[0]?.id ?? "");
  const [avail, setAvail] = useState(existing?.is_available ?? true);

  const save = async () => {
    if (!catId) return toast.error("Pick a category");
    try {
      await upsertMenuItem({
        data: {
          id: existing?.id,
          category_id: catId,
          name, description,
          price_lkr: Number(price),
          is_available: avail,
        },
      });
      if (!existing) { setName(""); setDescription(""); setPrice(500); }
      onSaved();
      toast.success("Saved");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className={existing ? "space-y-2" : "mt-3 grid gap-2 rounded-md border border-dashed border-border p-3 md:grid-cols-2"}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
      <select value={catId} onChange={(e) => setCatId(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm md:col-span-2" />
      <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price (LKR)" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={avail} onChange={(e) => setAvail(e.target.checked)} /> Available</label>
      <div className="flex gap-2 md:col-span-2">
        <button onClick={save} className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">
          {existing ? "Save" : "Add item"}
        </button>
        {existing && (
          <button
            onClick={async () => {
              if (!confirm("Delete this item?")) return;
              try { await deleteMenuItem({ data: { id: existing.id } }); onSaved(); }
              catch (e: any) { toast.error(e.message); }
            }}
            className="text-xs text-destructive hover:underline"
          >Delete</button>
        )}
      </div>
    </div>
  );
}

/* ---------- Tables admin ---------- */
function TablesAdmin({ onChange }: { onChange: () => void }) {
  const tables = useQuery({ queryKey: ["tables"], queryFn: () => getTables() });
  const [label, setLabel] = useState("");
  const [seats, setSeats] = useState(2);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (e.g. T6)" className="rounded-md border border-input bg-card px-3 py-2 text-sm" />
        <input type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="w-24 rounded-md border border-input bg-card px-3 py-2 text-sm" />
        <button
          onClick={async () => {
            if (!label.trim()) return;
            try { await upsertTable({ data: { label: label.trim(), seats } }); setLabel(""); onChange(); }
            catch (e: any) { toast.error(e.message); }
          }}
          className="rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90"
        >Add</button>
      </div>
      <ul className="mt-4 space-y-2">
        {(tables.data ?? []).map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm">
            <span>{t.label} · {t.seats} seats</span>
            <button
              onClick={async () => {
                if (!confirm(`Delete ${t.label}?`)) return;
                try { await deleteTable({ data: { id: t.id } }); onChange(); }
                catch (e: any) { toast.error(e.message); }
              }}
              className="text-xs text-destructive hover:underline"
            >Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Reservations admin ---------- */
function ReservationsAdmin({ onChange }: { onChange: () => void }) {
  const [date, setDate] = useState(today());
  const tables = useQuery({ queryKey: ["tables"], queryFn: () => getTables() });
  const res = useQuery({ queryKey: ["reservations", date], queryFn: () => listReservations({ data: { date } }) });

  const [form, setForm] = useState({
    table_id: "", start_hour: 12, duration_hours: 1, customer_name: "", customer_phone: "", notes: "",
  });

  const submit = async () => {
    if (!form.table_id) return toast.error("Pick a table");
    try {
      await createReservation({
        data: { ...form, reservation_date: date },
      });
      setForm({ ...form, customer_name: "", customer_phone: "", notes: "" });
      res.refetch();
      onChange();
      toast.success("Reservation created");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-3">
        <span className="text-sm uppercase tracking-wider text-muted-foreground">Date</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-md border border-input bg-card px-3 py-2 text-sm" />
      </label>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-display text-xl">New reservation</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <select value={form.table_id} onChange={(e) => setForm({ ...form, table_id: e.target.value })} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
            <option value="">Select table</option>
            {(tables.data ?? []).map((t) => <option key={t.id} value={t.id}>{t.label} ({t.seats})</option>)}
          </select>
          <input type="number" min={0} max={23} value={form.start_hour} onChange={(e) => setForm({ ...form, start_hour: Number(e.target.value) })} placeholder="Start hour" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          <input type="number" min={1} max={12} value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: Number(e.target.value) })} placeholder="Hours" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Customer name" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          <input value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} placeholder="Phone" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optional)" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
        </div>
        <button onClick={submit} className="mt-3 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Create reservation</button>
      </div>

      <div>
        <h3 className="font-display text-xl">Reservations on {date}</h3>
        <ul className="mt-3 space-y-2">
          {(res.data ?? []).length === 0 && <li className="text-sm text-muted-foreground">None yet.</li>}
          {(res.data ?? []).map((r) => {
            const tbl = tables.data?.find((t) => t.id === r.table_id);
            return (
              <li key={r.id} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm">
                <div>
                  <div><strong>{tbl?.label ?? r.table_id}</strong> · {String(r.start_hour).padStart(2,"0")}:00 ({r.duration_hours}h)</div>
                  <div className="text-xs text-muted-foreground">{r.customer_name} · {r.customer_phone}{r.notes ? ` · ${r.notes}` : ""}</div>
                </div>
                <button
                  onClick={async () => {
                    if (!confirm("Cancel this reservation?")) return;
                    try { await deleteReservation({ data: { id: r.id } }); res.refetch(); onChange(); }
                    catch (e: any) { toast.error(e.message); }
                  }}
                  className="text-xs text-destructive hover:underline"
                >Cancel</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Settings admin ---------- */
function SettingsAdmin({ onChange }: { onChange: () => void }) {
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });
  const [rate, setRate] = useState("");
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");

  useEffect(() => {
    if (settings.data) {
      setRate(settings.data.hourly_rate_lkr ?? "");
      setPhone(settings.data.restaurant_phone ?? "");
      setOpen(settings.data.opening_hour ?? "8");
      setClose(settings.data.closing_hour ?? "22");
    }
  }, [settings.data]);

  const save = async (key: string, value: string) => {
    try { await updateSetting({ data: { key, value } }); onChange(); toast.success("Saved"); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="grid max-w-xl gap-4">
      <Field label="Hourly table rate (LKR)" value={rate} onChange={setRate} onSave={() => save("hourly_rate_lkr", rate)} />
      <Field label="Restaurant phone" value={phone} onChange={setPhone} onSave={() => save("restaurant_phone", phone)} />
      <Field label="Opening hour (0–23)" value={open} onChange={setOpen} onSave={() => save("opening_hour", open)} />
      <Field label="Closing hour (0–23)" value={close} onChange={setClose} onSave={() => save("closing_hour", close)} />
    </div>
  );
}

function Field({ label, value, onChange, onSave }: { label: string; value: string; onChange: (v: string) => void; onSave: () => void }) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1 flex gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
        <button onClick={onSave} className="rounded-md bg-primary px-3 text-sm text-primary-foreground hover:bg-primary/90">Save</button>
      </div>
    </div>
  );
}
