-- Kullanıcı profilleri tablosu
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Güncelleme tarihini otomatik güncelle
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

-- RLS politikaları
alter table public.profiles enable row level security;

drop policy if exists "Kendi profilini görüntüle" on public.profiles;
create policy "Kendi profilini görüntüle"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Kendi profilini oluştur" on public.profiles;
create policy "Kendi profilini oluştur"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Kendi profilini güncelle" on public.profiles;
create policy "Kendi profilini güncelle"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

