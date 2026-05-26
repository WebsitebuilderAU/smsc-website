-- ============ Contact submissions — admin read/delete policies ============
-- The base table + insert policy already exists in schema.sql.
-- This migration adds authenticated read/delete so admins can view submissions
-- in /admin/contact and remove spam.

do $$
begin
  if not exists (select 1 from pg_policies where polname = 'auth read contact_submissions') then
    create policy "auth read contact_submissions" on public.contact_submissions
      for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'auth delete contact_submissions') then
    create policy "auth delete contact_submissions" on public.contact_submissions
      for delete to authenticated using (true);
  end if;
end $$;
