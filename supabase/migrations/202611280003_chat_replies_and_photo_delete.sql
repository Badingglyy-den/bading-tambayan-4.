-- Online Tambayan: threaded replies and sender-controlled photo removal.
alter table public.messages
  add column if not exists reply_to bigint
  references public.messages(id) on delete set null;

create index if not exists messages_reply_to_idx
  on public.messages(reply_to);

alter table public.messages enable row level security;

drop policy if exists "Users can delete their own chat photos" on public.messages;
create policy "Users can delete their own chat photos"
  on public.messages
  for delete
  to authenticated
  using (
    auth.uid() = user_id
    and content like '[[PHOTO]]%'
  );

grant delete on public.messages to authenticated;

-- Chat photo paths are stored as: room_id/user_id/filename.
drop policy if exists "Users can delete their own chat photos" on storage.objects;
create policy "Users can delete their own chat photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'chat-photos'
    and split_part(name, '/', 2) = auth.uid()::text
  );
