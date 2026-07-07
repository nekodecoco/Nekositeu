-- ═══════════════════════════════════════════════════════════════════════════
-- 003_storage_select.sql — fix silent storage deletes
-- The storage API resolves objects with a SELECT before deleting them, so
-- without a select policy remove() returns success while deleting nothing.
-- Run in the Supabase SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════════

create policy "admin read cat photos" on storage.objects
  for select to authenticated using (bucket_id = 'cat-photos');
create policy "admin read cafe photos" on storage.objects
  for select to authenticated using (bucket_id = 'cafe-photos');
