
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Menu items
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_lkr numeric(10,2) NOT NULL,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read menu" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write menu" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tables
CREATE TABLE public.tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  seats int NOT NULL DEFAULT 2,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tables TO anon, authenticated;
GRANT ALL ON public.tables TO service_role;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tables" ON public.tables FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write tables" ON public.tables FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Reservations
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES public.tables(id) ON DELETE CASCADE NOT NULL,
  reservation_date date NOT NULL,
  start_hour int NOT NULL CHECK (start_hour >= 0 AND start_hour <= 23),
  duration_hours int NOT NULL DEFAULT 1 CHECK (duration_hours >= 1 AND duration_hours <= 12),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX reservations_lookup_idx ON public.reservations(reservation_date, table_id);
GRANT SELECT ON public.reservations TO anon, authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
-- Public can SELECT but the server function strips PII; we still allow it because UI uses server fn.
CREATE POLICY "public read reservations basic" ON public.reservations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write reservations" ON public.reservations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Settings
CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write settings" ON public.settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed
INSERT INTO public.categories (name, sort_order) VALUES
  ('Coffee', 1), ('Mochi', 2), ('Specials', 3);

INSERT INTO public.menu_items (category_id, name, description, price_lkr) VALUES
  ((SELECT id FROM public.categories WHERE name='Coffee'), 'Espresso', 'Bold single-origin Sri Lankan espresso shot.', 500),
  ((SELECT id FROM public.categories WHERE name='Coffee'), 'Caramel Latte', 'Silky steamed milk, espresso, house caramel.', 750),
  ((SELECT id FROM public.categories WHERE name='Coffee'), 'Cold Brew', '18-hour slow steeped, smooth and sweet.', 850),
  ((SELECT id FROM public.categories WHERE name='Mochi'), 'Strawberry Mochi', 'Pillowy rice cake with fresh strawberry cream.', 450),
  ((SELECT id FROM public.categories WHERE name='Mochi'), 'Matcha Mochi', 'Ceremonial-grade matcha, white chocolate ganache.', 500),
  ((SELECT id FROM public.categories WHERE name='Mochi'), 'Chocolate Hazelnut Mochi', 'Dark chocolate, toasted hazelnut praline core.', 550),
  ((SELECT id FROM public.categories WHERE name='Specials'), 'Mochi-ccino', 'Signature cappuccino served with a warm mochi pair.', 950),
  ((SELECT id FROM public.categories WHERE name='Specials'), 'Caramel Mochi Affogato', 'Vanilla mochi drowned in espresso and caramel.', 1100);

INSERT INTO public.tables (label, seats) VALUES
  ('T1', 2), ('T2', 2), ('T3', 4), ('T4', 4), ('T5', 6);

INSERT INTO public.settings (key, value) VALUES
  ('hourly_rate_lkr', '1500'),
  ('restaurant_phone', '+94 33 222 3344'),
  ('opening_hour', '8'),
  ('closing_hour', '22');
