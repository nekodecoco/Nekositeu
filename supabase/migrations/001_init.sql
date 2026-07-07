-- ═══════════════════════════════════════════════════════════════════════════
-- 001_init.sql — schema, RLS, storage buckets
-- Run this in the Supabase dashboard → SQL Editor (before 002_seed.sql).
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Enums ────────────────────────────────────────────────────────────────────
create type project_status as enum ('LIVE', 'PROGRESS', 'ARCHIVED');
create type block_color as enum ('blue', 'orange', 'peach', 'gray');

-- ── Tables ───────────────────────────────────────────────────────────────────

-- Text ids ("c1"…) preserved so existing /cats/c1 URLs keep working.
create table cats (
  id text primary key,
  resident_number text not null,
  name text not null,
  breed text not null,
  arrival_date text not null, -- human-readable, matches current UI ("June 12, 2021")
  birthday date not null,
  description text not null,
  personality text not null,
  gradient_from text not null,
  gradient_to text not null,
  created_at timestamptz not null default now()
);

create table cat_photos (
  id uuid primary key default gen_random_uuid(),
  cat_id text not null references cats(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating numeric(2,1) not null check (rating >= 0 and rating <= 5),
  tags text[] not null default '{}',
  visit_date date not null,
  journal text not null default '',
  created_at timestamptz not null default now()
);

create table cafe_photos (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references cafes(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  status project_status not null default 'PROGRESS',
  tags text[] not null default '{}',
  tech_tags text[] not null default '{}',
  live_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  day_index smallint not null check (day_index between 0 and 6),
  title text not null,
  subtitle text,
  start_hour text not null,
  end_hour text not null,
  row_start int not null,
  row_end int not null,
  color_type block_color not null default 'gray',
  status text,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table cats enable row level security;
alter table cat_photos enable row level security;
alter table cafes enable row level security;
alter table cafe_photos enable row level security;
alter table projects enable row level security;
alter table schedule_blocks enable row level security;

-- Public (anon) read on portfolio content
create policy "public read cats"        on cats        for select using (true);
create policy "public read cat_photos"  on cat_photos  for select using (true);
create policy "public read cafes"       on cafes       for select using (true);
create policy "public read cafe_photos" on cafe_photos for select using (true);
create policy "public read projects"    on projects    for select using (true);

-- Admin writes. Signups are disabled in the dashboard and only one user
-- exists, so "authenticated" means the admin.
create policy "admin write cats"        on cats        for all to authenticated using (true) with check (true);
create policy "admin write cat_photos"  on cat_photos  for all to authenticated using (true) with check (true);
create policy "admin write cafes"       on cafes       for all to authenticated using (true) with check (true);
create policy "admin write cafe_photos" on cafe_photos for all to authenticated using (true) with check (true);
create policy "admin write projects"    on projects    for all to authenticated using (true) with check (true);

-- Schedule is fully private: NO anon policy at all → anon queries return 0 rows.
create policy "admin all schedule" on schedule_blocks for all to authenticated using (true) with check (true);

-- ── Storage buckets ──────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('cat-photos', 'cat-photos', true),
  ('cafe-photos', 'cafe-photos', true);

create policy "admin upload cat photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'cat-photos');
create policy "admin delete cat photos" on storage.objects
  for delete to authenticated using (bucket_id = 'cat-photos');
create policy "admin upload cafe photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'cafe-photos');
create policy "admin delete cafe photos" on storage.objects
  for delete to authenticated using (bucket_id = 'cafe-photos');
