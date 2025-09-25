-- Create table to store per-day habit state
create table if not exists public.habit_states (
  user_id   text        not null,
  date      date        not null,
  data      jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint habit_states_pkey primary key (user_id, date)
);

-- Enable Row Level Security
alter table public.habit_states enable row level security;

-- Policies: allow a client to access only rows where user_id equals the header `x-habit-id`
-- PostgREST exposes request headers at current_setting('request.headers', true) as JSON.

drop policy if exists "read own" on public.habit_states;
create policy "read own" on public.habit_states
for select using (
  ((current_setting('request.headers', true))::json ->> 'x-habit-id') = user_id
);

drop policy if exists "insert own" on public.habit_states;
create policy "insert own" on public.habit_states
for insert with check (
  ((current_setting('request.headers', true))::json ->> 'x-habit-id') = user_id
);

drop policy if exists "update own" on public.habit_states;
create policy "update own" on public.habit_states
for update using (
  ((current_setting('request.headers', true))::json ->> 'x-habit-id') = user_id
)
with check (
  ((current_setting('request.headers', true))::json ->> 'x-habit-id') = user_id
);

drop policy if exists "delete own" on public.habit_states;
create policy "delete own" on public.habit_states
for delete using (
  ((current_setting('request.headers', true))::json ->> 'x-habit-id') = user_id
);

-- Optional: grant privileges (RLS still applies)
grant select, insert, update, delete on public.habit_states to anon, authenticated;

