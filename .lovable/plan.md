
## Mochiato Gampaha — Cafe Website + Reservations + Admin

A warm, espresso/caramel/cream-themed cafe site for Mochiato Gampaha. Public visitors browse the menu and see which tables are reserved per hour; reservations are created only by admin (after a customer phone call). An admin panel manages menu, categories, prices, tables, the hourly table rate, and reservations.

### Stack
- React + TanStack Start (existing project) with TypeScript
- Tailwind + semantic design tokens in `src/styles.css`
- Lovable Cloud (Postgres + Auth) replaces the requested PHP/MySQL backend
- Google Fonts: Playfair Display (headings) + Montserrat (body)
- AI-generated hero & menu imagery (espresso / mochi / cafe interior)

### Pages / Routes
- `/` — Hero (full-screen image + dark overlay + "Mochiato." logo + "Where Coffee Meets Mochi" tagline + "View Menu" CTA), highlights, footer (Gampaha address, hours, contact)
- `/menu` — Categorized grid: Coffee, Mochi, Specials (data from DB)
- `/reservations` — Public read-only view: list of tables, today/selectable date, hourly grid showing which hours are booked vs free, hourly rate displayed, "Call to reserve" CTA with phone number
- `/login` — Admin email/password login
- `/admin` (protected, admin role only)
  - Categories CRUD
  - Menu items CRUD (name, description, price in LKR, category, image)
  - Tables CRUD (label, seats)
  - Settings: hourly table rate (LKR), restaurant phone
  - Reservations: create / cancel reservations (pick table + date + start hour + duration + customer name/phone)

### Design
- Palette (oklch tokens): deep espresso background, warm caramel primary, cream foreground, muted mocha
- Playfair Display for H1/H2, Montserrat for body
- Mobile-first; CSS Grid for menu & hourly reservation matrix; subtle hover/scale animations on cards

### Database (Lovable Cloud / Postgres)
- `categories(id, name, sort_order, created_at)`
- `menu_items(id, category_id fk, name, description, price_lkr numeric, image_url, is_available, created_at)`
- `tables(id, label, seats, created_at)`
- `reservations(id, table_id fk, reservation_date date, start_hour int 0–23, duration_hours int, customer_name, customer_phone, notes, created_by uuid, created_at)` — unique constraint preventing overlap per table/date/hour
- `settings(key text pk, value text)` — stores `hourly_rate_lkr`, `restaurant_phone`
- `user_roles(user_id, role app_role)` with `app_role` enum (`admin`) and `has_role()` security-definer function (per project rules — roles never on profiles)

RLS:
- `categories`, `menu_items`, `tables`, `reservations` (read-only fields), `settings` → public SELECT
- All INSERT/UPDATE/DELETE → restricted to `has_role(auth.uid(), 'admin')`
- Public sees reservations only as occupied hours (no customer PII exposed to anon — server fn returns redacted shape)

### Server functions (`createServerFn`)
- Public: `listMenu`, `listTables`, `listOccupiedHours(date)`, `getSettings`
- Admin (protected by `requireSupabaseAuth` + role check): CRUD for categories/menu/tables/reservations/settings

### Seed data
5+ sample menu items in LKR (e.g. Espresso Rs. 500, Caramel Latte Rs. 750, Strawberry Mochi Rs. 450, Matcha Mochi Rs. 500, Mochi-ccino Special Rs. 950), 4 sample tables, default hourly rate Rs. 1500.

### Out of scope (per your answers)
- Online self-booking by customers (phone-only)
- Payment processing
- Staff/multi-role accounts

### First-run setup the user will do
- Sign up once, then I'll promote that account to `admin` via a migration so they can access `/admin`.

### Deliverable note
This replaces the requested `database.sql` / `api.php` / `index.html` / `style.css` / `script.js` with the equivalent functionality in the project's React + Lovable Cloud stack, since the project can't run PHP. If you ever need the PHP/MySQL export later, I can generate it as downloadable files in a separate pass.
