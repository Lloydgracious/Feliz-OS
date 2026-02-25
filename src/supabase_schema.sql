-- Feliz / OS Supabase schema
-- Paste this into Supabase SQL Editor and run.
-- Includes: products, vlog_video_posts, vlog_experience_posts
-- RLS: public read; write allowed only to authenticated users (admin accounts).

-- Extensions
create extension if not exists pgcrypto;

-- STORAGE (create these buckets in Supabase Storage UI)
-- - product-images (public)
-- - order-proofs (public)

-- PRODUCTS
create table if not exists public.products (
  id text primary key,
  type text,
  category text,
  name text not null,
  knot text,
  colors text[] not null default '{}',
  price integer not null default 0,
  image text,
  description text,
  show_on_home boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_show_on_home_idx on public.products (show_on_home);
create index if not exists products_sort_order_idx on public.products (sort_order);

-- VLOG (VIDEOS)
create table if not exists public.vlog_video_posts (
  id text primary key,
  title text not null,
  url text not null,
  note text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vlog_video_posts_sort_order_idx on public.vlog_video_posts (sort_order);

-- VLOG (EXPERIENCE POSTS)
create table if not exists public.vlog_experience_posts (
  id text primary key,
  date date,
  title text not null,
  mood text,
  image text,
  text text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- SITE SETTINGS (simple key/value)
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- ORDERS
create table if not exists public.orders (
  id text primary key,
  order_code text not null,
  status text not null default 'pending_payment',
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  total integer not null default 0,
  proof_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  price integer not null,
  quantity integer not null default 1,
  meta text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

create index if not exists vlog_experience_posts_sort_order_idx on public.vlog_experience_posts (sort_order);

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_vlog_video_updated_at on public.vlog_video_posts;
create trigger set_vlog_video_updated_at
before update on public.vlog_video_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_vlog_experience_updated_at on public.vlog_experience_posts;
create trigger set_vlog_experience_updated_at
before update on public.vlog_experience_posts
for each row execute function public.set_updated_at();

-- site_settings updated_at
create or replace function public.set_site_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_site_settings_updated_at();

-- RLS
alter table public.products enable row level security;
alter table public.vlog_video_posts enable row level security;
alter table public.vlog_experience_posts enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read
drop policy if exists "public_read_products" on public.products;
create policy "public_read_products"
on public.products
for select
using (true);

drop policy if exists "public_read_vlog_video_posts" on public.vlog_video_posts;
create policy "public_read_vlog_video_posts"
on public.vlog_video_posts
for select
using (true);

drop policy if exists "public_read_vlog_experience_posts" on public.vlog_experience_posts;
create policy "public_read_vlog_experience_posts"
on public.vlog_experience_posts
for select
using (true);

drop policy if exists "public_read_site_settings" on public.site_settings;
create policy "public_read_site_settings"
on public.site_settings
for select
using (true);

-- Orders:
-- - Customers are not logged in, so allow public INSERT only.
-- - Only admins can READ/UPDATE/DELETE.

-- Admin write: only users with profiles.role = 'admin'

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, role)
  values (new.id, new.email, 'user')
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;

-- helper function (security definer) to check admin
-- NOTE: must exist BEFORE any policy that references it.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

drop policy if exists "self_read_profiles" on public.profiles;
create policy "self_read_profiles" on public.profiles
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "admin_read_profiles" on public.profiles;
create policy "admin_read_profiles" on public.profiles
for select to authenticated
using (public.is_admin());

-- profiles can be inserted/updated only by admins (or via SQL)
drop policy if exists "admin_write_profiles" on public.profiles;
create policy "admin_write_profiles" on public.profiles
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "auth_write_products" on public.products;
create policy "auth_write_products"
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "auth_write_vlog_video_posts" on public.vlog_video_posts;
create policy "auth_write_vlog_video_posts"
on public.vlog_video_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "auth_write_vlog_experience_posts" on public.vlog_experience_posts;
create policy "auth_write_vlog_experience_posts"
on public.vlog_experience_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "auth_write_site_settings" on public.site_settings;
create policy "auth_write_site_settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- orders: public insert, admin read/write

drop policy if exists "public_insert_orders" on public.orders;
create policy "public_insert_orders" on public.orders
for insert
to anon
with check (true);

drop policy if exists "public_insert_order_items" on public.order_items;
create policy "public_insert_order_items" on public.order_items
for insert
to anon
with check (true);

drop policy if exists "admin_read_orders" on public.orders;
create policy "admin_read_orders" on public.orders
for select to authenticated
using (public.is_admin());

drop policy if exists "admin_write_orders" on public.orders;
create policy "admin_write_orders" on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_delete_orders" on public.orders;
create policy "admin_delete_orders" on public.orders
for delete
to authenticated
using (public.is_admin());

drop policy if exists "admin_read_order_items" on public.order_items;
create policy "admin_read_order_items" on public.order_items
for select to authenticated
using (public.is_admin());

drop policy if exists "admin_write_order_items" on public.order_items;
create policy "admin_write_order_items" on public.order_items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_delete_order_items" on public.order_items;
create policy "admin_delete_order_items" on public.order_items
for delete
to authenticated
using (public.is_admin());
