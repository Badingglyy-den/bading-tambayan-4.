-- Separate chatroom identity from the main Bading Tambayan / Avatar Studio profile.
create table if not exists public.chat_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Tambay',
  avatar text not null default '💜',
  updated_at timestamptz not null default now()
);

-- Preserve each member's current chatroom identity when separating the profiles.
insert into public.chat_profiles (user_id, display_name, avatar)
select user_id, coalesce(nullif(display_name, ''), 'Tambay'), coalesce(nullif(avatar, ''), '💜')
from public.profiles
on conflict (user_id) do nothing;

alter table public.chat_profiles enable row level security;

drop policy if exists "Authenticated users can read chat profiles" on public.chat_profiles;
create policy "Authenticated users can read chat profiles"
  on public.chat_profiles for select to authenticated
  using (true);

drop policy if exists "Users can create their own chat profile" on public.chat_profiles;
create policy "Users can create their own chat profile"
  on public.chat_profiles for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own chat profile" on public.chat_profiles;
create policy "Users can update their own chat profile"
  on public.chat_profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.chat_profiles to authenticated;
