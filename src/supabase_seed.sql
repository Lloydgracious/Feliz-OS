-- Seed data for Feliz
-- Run after schema.

-- PRODUCTS
insert into public.products (id, type, category, name, knot, colors, price, image, description, show_on_home, sort_order)
values
  (
    'bracelet-dragon-sky', 'Bracelet', 'Knots', 'Dragon Knot Bracelet', 'Dragon', array['Sky Blue','Silver'], 168000,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=60',
    'A bold dragon knot with a modern sky-blue silk cord. Hand-finished for a refined, protective aura.',
    true, 10
  ),
  (
    'bracelet-mystic-ivory', 'Bracelet', 'Knots', 'Mystic Loop Bracelet', 'Mystic', array['White Jade','Silver'], 148000,
    'https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=60',
    'Minimal and luminous. The mystic knot symbolizes continuity and harmony — elevated in icy tones.',
    true, 20
  ),
  (
    'keychain-doublecoin-red', 'Keychain', 'Keychains', 'Double Coin Keychain', 'Double Coin', array['Crimson','Gold'], 98000,
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8f45?auto=format&fit=crop&w=1200&q=60',
    'A prosperity classic — polished metal accents with a rich red cord for everyday fortune.',
    true, 30
  ),
  (
    'bracelet-clover-emerald', 'Bracelet', 'Knots', 'Clover Charm Bracelet', 'Clover', array['Emerald','Ivory'], 158000,
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=60',
    'A clean clover profile with an emerald cord — understated luck, designed for premium layering.',
    false, 40
  ),
  (
    'keychain-fortune-onyx', 'Keychain', 'Keychains', 'Fortune Talisman Keychain', 'Fortune', array['Black Onyx','Silver'], 108000,
    'https://images.unsplash.com/photo-1602526219045-5f5b0b5e0e2c?auto=format&fit=crop&w=1200&q=60',
    'Deep onyx tones, a refined silhouette, and a quiet statement of strength and protection.',
    false, 50
  ),
  (
    'bracelet-fortune-rose', 'Bracelet', 'Knots', 'Fortune Bloom Bracelet', 'Fortune', array['Soft Pink','Silver'], 152000,
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=60',
    'A delicate fortune knot paired with soft pink silk — gentle elegance, perfect for gifting.',
    true, 60
  )
on conflict (id) do update set
  type = excluded.type,
  category = excluded.category,
  name = excluded.name,
  knot = excluded.knot,
  colors = excluded.colors,
  price = excluded.price,
  image = excluded.image,
  description = excluded.description,
  show_on_home = excluded.show_on_home,
  sort_order = excluded.sort_order;

-- VLOG VIDEO POSTS
insert into public.vlog_video_posts (id, title, url, note, sort_order)
values
  ('vid-1', 'Knot tying basics', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'A simple walkthrough — great for beginners.', 10),
  ('vid-2', 'Studio vlog: a full day', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Cutting cord, tensioning, finishing, and packaging.', 20),
  ('vid-3', 'Colorways: matching tones', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'How we pair cool blues with silver accents.', 30)
on conflict (id) do update set
  title = excluded.title,
  url = excluded.url,
  note = excluded.note,
  sort_order = excluded.sort_order;

-- SITE SETTINGS
insert into public.site_settings (key, value)
values
  ('home_hero_badge', 'Premium handmade Chinese knots'),
  ('home_hero_title', 'Craft Your Own Fortune'),
  ('home_hero_subtitle', 'Feliz handmade bracelets & keychains — culturally inspired, minimal, and made to bring joy.'),
  ('home_hero_image', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1600&q=60'),
  ('home_collection_eyebrow', 'Collection'),
  ('home_collection_title', 'Signature pieces, designed for modern layering'),
  ('home_collection_subtitle', 'Our current drop — ready to wear or gift.'),
  ('shop_eyebrow', 'Collection'),
  ('shop_title', 'Shop the curated drop'),
  ('shop_subtitle', 'Filter by category, color, and knot — then open a quick view modal or add to cart with a smooth premium interaction.'),
  ('shop_banner', '')
on conflict (key) do update set value = excluded.value;

-- PROFILES (admin)
-- IMPORTANT: replace user_id with the UUID of your auth user (after you create the user)
-- insert into public.profiles (user_id, email, role) values ('YOUR-USER-ID-UUID', 'leftlloydinmyths@gmail.com', 'admin')
-- on conflict (user_id) do update set role = excluded.role, email = excluded.email;

-- VLOG EXPERIENCE POSTS
insert into public.vlog_experience_posts (id, date, title, mood, image, text, sort_order)
values
  (
    'exp-1', '2026-02-03', 'A tiny mistake that made the knot better', 'Studio story',
    'https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1600&q=60',
    'I pulled the cord too tight, the geometry shifted, and suddenly the silhouette looked cleaner. Handmade is like that — the best details are sometimes happy accidents.',
    10
  ),
  (
    'exp-2', '2026-02-09', 'Why sky-blue + silver feels expensive', 'Palette note',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1600&q=60',
    'Cool tones make spacing feel larger. Add a quiet highlight — silver — and everything becomes more modern. Feliz is built around that calm luxury feeling.',
    20
  ),
  (
    'exp-3', '2026-02-18', 'Packaging day: the calm part of craft', 'Behind the scenes',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=60',
    'Folding, spacing, the little cultural card — packaging is where the experience becomes real. Quiet luxury is mostly restraint.',
    30
  )
on conflict (id) do update set
  date = excluded.date,
  title = excluded.title,
  mood = excluded.mood,
  image = excluded.image,
  text = excluded.text,
  sort_order = excluded.sort_order;
