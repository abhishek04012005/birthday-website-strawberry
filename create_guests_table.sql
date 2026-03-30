create table if not exists guests (
  id bigint primary key generated always as identity,
  title text not null,
  name text not null,
  phone text,
  child_name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table guests enable row level security;

drop policy if exists "authenticated_can_manage_guests" on guests;
drop policy if exists "authenticated_can_read_guests" on guests;
drop policy if exists "public_can_manage_guests" on guests;

create policy "public_can_manage_guests" on guests
  for all
  using (true)
  with check (true);