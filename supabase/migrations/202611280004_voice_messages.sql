-- Voice messages for Bading Tambayan chatrooms
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-voice',
  'chat-voice',
  false,
  10485760,
  array['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg', 'audio/wav']
)
on conflict (id) do update
set public = false,
    file_size_limit = 10485760,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Chat members can upload their own voice messages" on storage.objects;
create policy "Chat members can upload their own voice messages"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'chat-voice'
    and split_part(name, '/', 2) = auth.uid()::text
  );

drop policy if exists "Authenticated users can listen to chat voice messages" on storage.objects;
create policy "Authenticated users can listen to chat voice messages"
  on storage.objects for select to authenticated
  using (bucket_id = 'chat-voice');

drop policy if exists "Users can delete their own voice messages" on storage.objects;
create policy "Users can delete their own voice messages"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'chat-voice'
    and split_part(name, '/', 2) = auth.uid()::text
  );
