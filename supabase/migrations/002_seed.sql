-- ═══════════════════════════════════════════════════════════════════════════
-- 002_seed.sql — migrate the previously hardcoded site data
-- Run in the Supabase SQL Editor AFTER 001_init.sql.
-- Note: cat_photos is intentionally NOT seeded (old seeds had no real images).
-- Note: seeded live_url values are NULL — the old ones were template
--       placeholders pointing at alexchen.dev.
-- ═══════════════════════════════════════════════════════════════════════════

insert into cats (id, resident_number, name, breed, arrival_date, birthday, description, personality, gradient_from, gradient_to) values
  ('c1', 'RESIDENT 01', 'Shadow', 'Russian Blue', 'June 12, 2021', '2020-03-04',
   'Obsessive code auditor and desk supervisor. Enjoys heat vents, mechanical keyboard clicks, and swatting at yarn threads during Figma sessions.',
   'Analytical · Stoic · Perpetually unimpressed', 'from-zinc-700', 'to-slate-900'),
  ('c2', 'RESIDENT 02', 'Marmalade', 'Ginger Tabby', 'October 04, 2019', '2018-07-11',
   'Head of morale and physical comfort. Specializes in sitting directly on layout specs, loud purring during video calls, and cataloging ambient light patches.',
   'Charismatic · Loud · Emotionally Available', 'from-orange-500/30', 'to-amber-950/80'),
  ('c3', 'RESIDENT 03', 'Pixel', 'Calico', 'March 15, 2022', '2021-11-22',
   'Quality assurance manager. Expert in micro-movement tracking, testing structural integrity of cardboard mockups, and general QA tasks around the studio.',
   'Meticulous · Playful · Chronically caffeinated', 'from-rose-500/20', 'to-neutral-900');

insert into cafes (name, rating, tags, visit_date, journal) values
  ('Kuro Studio',  5.0, array['MINIMALIST','SILENT','BRUTALIST'],   '2023-10-12', ''),
  ('Draft House',  4.8, array['GOOD WIFI','URBAN'],                 '2023-09-28', ''),
  ('The Archive',  4.5, array['LIBRARY','COZY'],                    '2023-08-15', ''),
  ('Orbit Coffee', 4.9, array['MODERN','SKYLINE'],                  '2023-07-04', ''),
  ('Mono Lab',     5.0, array['MATCHA','PRECISION'],                '2023-06-22', ''),
  ('Canvas Brews', 4.7, array['CREATIVE','ART','GOOD WIFI'],        '2023-05-10', '');

insert into projects (title, description, status, tags, tech_tags, live_url, featured, sort_order) values
  ('Neural Nexus',
   'An advanced AI-driven visualization tool mapping complex neural networks in real-time.',
   'LIVE', array['NEXT.JS','THREE.JS','TAILWIND','REACT','TYPESCRIPT','WEBGL'],
   array['NEXT.JS','THREE.JS','TAILWIND'], null, false, 0),
  ('Ethereal Task',
   'A minimalist productivity suite focusing on deep work, focus tracking, and flow-state analytics.',
   'PROGRESS', array['REACT NATIVE','EXPO','SUPABASE','TYPESCRIPT','REACT'],
   array['REACT NATIVE','EXPO','SUPABASE'], null, false, 1),
  ('Void Ledger',
   'A legacy experimental blockchain explorer for sidechain assets. Optimized for cryptographic audits.',
   'ARCHIVED', array['RUST','WASM','D3.JS','TYPESCRIPT'],
   array['RUST','WASM','D3.JS'], null, false, 2);

insert into schedule_blocks (day_index, title, subtitle, start_hour, end_hour, row_start, row_end, color_type, status) values
  (0, 'Deep Focus: WebGL',    'Render optimization',  '09:00', '11:00', 2, 4,  'gray',   null),
  (1, 'Design System Audit',  'Atomic Token review',  '11:00', '14:00', 4, 7,  'orange', null),
  (2, 'UI Implementation',    'Next.js routing',      '09:00', '11:00', 2, 4,  'blue',   'IN PROGRESS'),
  (2, 'Team Sync',            'Handoff alignment',    '13:00', '14:00', 6, 7,  'gray',   null),
  (3, 'Portfolio Research',   'Layout references',    '12:00', '14:00', 5, 7,  'gray',   null),
  (4, 'Critical Fixes',       'WASM memory leak',     '14:00', '17:00', 7, 10, 'peach',  null);
