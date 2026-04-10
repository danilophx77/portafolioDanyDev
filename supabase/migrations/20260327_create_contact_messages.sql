create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  company text not null default '',
  ip_hash text,
  origin text,
  user_agent text,
  source text not null default 'portfolio',
  delivery_status text not null default 'received',
  email_status text not null default 'pending',
  provider_message_id text
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_email_idx
  on public.contact_messages (email);

create index if not exists contact_messages_ip_hash_created_at_idx
  on public.contact_messages (ip_hash, created_at desc);

alter table public.contact_messages enable row level security;
