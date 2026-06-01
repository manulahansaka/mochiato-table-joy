import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ---------- Public reads (no auth) ---------- */

export const getMenu = createServerFn({ method: "GET" }).handler(async () => {
  const { data: categories, error: catErr } = await supabaseAdmin
    .from("categories")
    .select("id, name, sort_order")
    .order("sort_order");
  if (catErr) throw new Error(catErr.message);

  const { data: items, error: itemErr } = await supabaseAdmin
    .from("menu_items")
    .select("id, category_id, name, description, price_lkr, image_url, is_available")
    .order("name");
  if (itemErr) throw new Error(itemErr.message);

  return { categories: categories ?? [], items: items ?? [] };
});

export const getTables = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .select("id, label, seats")
    .order("label");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("settings").select("key, value");
  if (error) throw new Error(error.message);
  const map: Record<string, string> = {};
  (data ?? []).forEach((r) => (map[r.key] = r.value));
  return map;
});

export const getOccupiedHours = createServerFn({ method: "POST" })
  .inputValidator((d: { date: string }) =>
    z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("reservations")
      .select("table_id, start_hour, duration_hours")
      .eq("reservation_date", data.date);
    if (error) throw new Error(error.message);
    // Expand to (table_id, hour) pairs, PII stripped
    const occupied: { table_id: string; hour: number }[] = [];
    (rows ?? []).forEach((r) => {
      for (let i = 0; i < r.duration_hours; i++) {
        occupied.push({ table_id: r.table_id, hour: r.start_hour + i });
      }
    });
    return occupied;
  });

/* ---------- Admin-only ---------- */

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

/* Categories */
export const upsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id?: string; name: string; sort_order: number }) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().min(1).max(80),
        sort_order: z.number().int().min(0).max(999),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("categories").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* Menu items */
export const upsertMenuItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      id?: string;
      category_id: string;
      name: string;
      description: string;
      price_lkr: number;
      is_available: boolean;
      image_url?: string | null;
    }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          category_id: z.string().uuid(),
          name: z.string().min(1).max(120),
          description: z.string().max(500).default(""),
          price_lkr: z.number().min(0).max(1_000_000),
          is_available: z.boolean(),
          image_url: z.string().url().nullable().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("menu_items").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMenuItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("menu_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* Tables */
export const upsertTable = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id?: string; label: string; seats: number }) =>
    z
      .object({
        id: z.string().uuid().optional(),
        label: z.string().min(1).max(20),
        seats: z.number().int().min(1).max(40),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("tables").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTable = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("tables").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* Settings */
export const updateSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string; value: string }) =>
    z
      .object({
        key: z.string().min(1).max(80),
        value: z.string().max(500),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("settings")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* Reservations */
export const listReservations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { date: string }) =>
    z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: rows, error } = await context.supabase
      .from("reservations")
      .select("id, table_id, reservation_date, start_hour, duration_hours, customer_name, customer_phone, notes, created_at")
      .eq("reservation_date", data.date)
      .order("start_hour");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      table_id: string;
      reservation_date: string;
      start_hour: number;
      duration_hours: number;
      customer_name: string;
      customer_phone: string;
      notes?: string;
    }) =>
      z
        .object({
          table_id: z.string().uuid(),
          reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          start_hour: z.number().int().min(0).max(23),
          duration_hours: z.number().int().min(1).max(12),
          customer_name: z.string().min(1).max(120),
          customer_phone: z.string().min(3).max(40),
          notes: z.string().max(500).optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    // Conflict check
    const { data: existing, error: exErr } = await context.supabase
      .from("reservations")
      .select("start_hour, duration_hours")
      .eq("table_id", data.table_id)
      .eq("reservation_date", data.reservation_date);
    if (exErr) throw new Error(exErr.message);

    const newHours = new Set<number>();
    for (let i = 0; i < data.duration_hours; i++) newHours.add(data.start_hour + i);
    for (const r of existing ?? []) {
      for (let i = 0; i < r.duration_hours; i++) {
        if (newHours.has(r.start_hour + i)) {
          throw new Error(`Hour ${r.start_hour + i}:00 already reserved for this table.`);
        }
      }
    }

    const { error } = await context.supabase.from("reservations").insert({
      ...data,
      created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("reservations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
