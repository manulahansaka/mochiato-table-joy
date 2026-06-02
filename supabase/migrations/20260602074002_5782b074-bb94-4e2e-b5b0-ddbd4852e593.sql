
-- 1) Wipe existing seed menu
DELETE FROM public.menu_items;
DELETE FROM public.categories;

-- 2) Insert categories
INSERT INTO public.categories (id, name, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Shawarma', 1),
  ('11111111-1111-1111-1111-111111111102', 'Chicken Burgers', 2),
  ('11111111-1111-1111-1111-111111111103', 'Beef Burgers', 3),
  ('11111111-1111-1111-1111-111111111104', 'Submarines', 4),
  ('11111111-1111-1111-1111-111111111105', 'Shawarma Add-Ons', 5),
  ('11111111-1111-1111-1111-111111111106', 'Chicken Burger Add-Ons', 6),
  ('11111111-1111-1111-1111-111111111107', 'Beef Burger Add-Ons', 7),
  ('11111111-1111-1111-1111-111111111108', 'Submarine Add-Ons', 8);

-- 3) Menu items
INSERT INTO public.menu_items (category_id, name, description, price_lkr) VALUES
-- Shawarma
('11111111-1111-1111-1111-111111111101','Classic Chicken Shawarma Wrap','Pan Fried Chicken, Lettuce, Garlic Sauce, Veggies, Fries',1460),
('11111111-1111-1111-1111-111111111101','Spicy Chicken Shawarma Wrap','Spicy Chicken, Special Sauce, Lettuce, Tomato, Onion, Green Chillies, Fries',1490),
('11111111-1111-1111-1111-111111111101','Chicken + Cheese Shawarma Wrap','Chicken + Melted Cheese, Onion, Green Salad Filling',1390),
('11111111-1111-1111-1111-111111111101','Classic Beef Shawarma Wrap','Marinated Minced Beef Cubes, Special Sauce, Veggies',1470),
('11111111-1111-1111-1111-111111111101','Spicy Beef Shawarma Wrap','Special Hot Sauce, Marinated Minced Beef Cubes, Green Chillies, Veggies, Fries',1650),
('11111111-1111-1111-1111-111111111101','Beef + Cheese Shawarma Wrap','Marinated Minced Beef Cubes, Double Cheese, Veggies',1690),
('11111111-1111-1111-1111-111111111101','Cheesy Mutton Shawarma Wrap','Juicy Mutton Cubes, Tomato, Herbs, Veggies, Fries',1920),
('11111111-1111-1111-1111-111111111101','Special Mixed Shawarma Wrap','Chicken & Beef, Double Cheese, Tomato, Veggies, Fries',1860),
-- Chicken Burgers
('11111111-1111-1111-1111-111111111102','Chicken Smash Burger','Chicken patty, Cheese, Butter-toasted bun, Lettuce, Tomato, Onions, Pineapple sauce',1060),
('11111111-1111-1111-1111-111111111102','Chicken Cheese Burger','Chicken patty, Onion, Tomato, Melted cheese',990),
('11111111-1111-1111-1111-111111111102','Double Chicken Burger','Two Chicken patties, Double cheese, Tomato, Pineapple Sauce, Special Sauce',1360),
('11111111-1111-1111-1111-111111111102','Crispy Chicken Burger','Crunchy Chicken Fillet, Lettuce, Tomato, Special Sauces',1180),
('11111111-1111-1111-1111-111111111102','Crispy Double Chicken Burger','Two Layers of Crispy Fillets, Double Cheese, Fresh Lettuce, Burger Sauce, Toasted Sesame Bun',1460),
('11111111-1111-1111-1111-111111111102','Spicy Chicken Burger','Chicken patty, Cheese, Butter-Toasted Bun, Green Chillies, Spicy sauce',990),
-- Beef Burgers
('11111111-1111-1111-1111-111111111103','Classic Beef Burger','Juicy Beef Patty, Lettuce, Tomato, House sauce',900),
('11111111-1111-1111-1111-111111111103','Cheese Burger','Beef patty, Melted cheese, Onions, Tomato',1100),
('11111111-1111-1111-1111-111111111103','Smash Burger','Smashed beef patty, Crispy edges, Cheese, Special sauce',1100),
('11111111-1111-1111-1111-111111111103','Double Beef Smash Burger','Two Beef Patties, Double Cheese, Tomato, Extra Sauce',1550),
('11111111-1111-1111-1111-111111111103','Spicy Double Grilled Beef Burger','Two Beef Patties, Double Cheese, Chillies, Spicy Sauce',1590),
-- Submarines
('11111111-1111-1111-1111-111111111104','Mini Chicken Submarine','Fried chicken and mayo salad filling',650),
('11111111-1111-1111-1111-111111111104','Mini Beef Submarine','Grilled beef with mayo salad filling',790),
('11111111-1111-1111-1111-111111111104','Creamy Chicken Submarine (XL)','Pan Fried Chicken With Cheese, Lettuce, Tomato, Special Sauce, Fries',1590),
('11111111-1111-1111-1111-111111111104','Tuna Submarine (XL)','Chillies And Olive Mixed Special Salad Filling, Fries, Tuna, Tomato',1560),
('11111111-1111-1111-1111-111111111104','Crispy Chicken Submarine (XL)','Crispy Chicken, Lettuce, Tomato, Onion, Pineapple Sauce, Fries',1760),
('11111111-1111-1111-1111-111111111104','Grilled Chicken Submarine (XL)','Grilled patties, Tomato, Onion, Special Sauce, Fries',1690),
('11111111-1111-1111-1111-111111111104','Spicy Mutton Submarine (XL)','Spicy Pan Fried Mutton With Herbs, Tomato, Lettuce, Onion, Special Sauce, Fries',1970),
('11111111-1111-1111-1111-111111111104','Grilled Beef Submarine (XL)','Grilled Beef Patties, Double Cheese, Onion, Green Chillies, Fries',1890),
-- Shawarma Add-Ons
('11111111-1111-1111-1111-111111111105','Extra Cheese','',300),
('11111111-1111-1111-1111-111111111105','Extra Meat (Chicken)','',450),
('11111111-1111-1111-1111-111111111105','Extra Meat (Beef)','',600),
('11111111-1111-1111-1111-111111111105','Extra Meat (Mutton)','',750),
('11111111-1111-1111-1111-111111111105','French Fries (Regular)','',450),
-- Chicken Burger Add-Ons
('11111111-1111-1111-1111-111111111106','Extra Cheese','',150),
('11111111-1111-1111-1111-111111111106','Extra Double Cheese','',300),
('11111111-1111-1111-1111-111111111106','Extra Meat (Chicken)','',360),
('11111111-1111-1111-1111-111111111106','French Fries (Regular)','',450),
-- Beef Burger Add-Ons
('11111111-1111-1111-1111-111111111107','Extra Cheese','',150),
('11111111-1111-1111-1111-111111111107','Extra Double Cheese','',300),
('11111111-1111-1111-1111-111111111107','Extra Meat (Beef)','',450),
('11111111-1111-1111-1111-111111111107','French Fries (Regular)','',450),
-- Submarine Add-Ons
('11111111-1111-1111-1111-111111111108','Extra Cheese','',300),
('11111111-1111-1111-1111-111111111108','Extra Meat (Chicken)','',450),
('11111111-1111-1111-1111-111111111108','Extra Meat (Beef)','',600),
('11111111-1111-1111-1111-111111111108','Extra Meat (Mutton)','',750),
('11111111-1111-1111-1111-111111111108','French Fries (Regular)','',450);

-- 4) Create admin user (email: admin@mochiato.lk / password: Mochiato@2026)
DO $$
DECLARE
  new_user_id uuid := '22222222-2222-2222-2222-222222222222';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@mochiato.lk') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated', 'authenticated',
      'admin@mochiato.lk',
      crypt('Mochiato@2026', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      '', '', '', ''
    );

    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', 'admin@mochiato.lk', 'email_verified', true),
      'email', new_user_id::text, now(), now(), now());
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'admin@mochiato.lk'
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
