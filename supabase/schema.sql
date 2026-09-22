-- Dear Friends: booking and enquiry tables.
-- Run in Supabase → SQL Editor (or as a migration).
-- The website writes with the service-role key from server-side functions only,
-- so Row Level Security is enabled with NO public policies: nobody can read or
-- write these tables from the browser.

create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  booking_date     date not null,
  booking_time     time not null,
  guests           smallint not null check (guests between 1 and 50),
  name             text not null check (char_length(name) between 2 and 100),
  phone            text not null,
  email            text not null,
  seating          text not null default 'no-preference'
                   check (seating in ('no-preference', 'inside', 'outside')),
  special_requests text check (char_length(special_requests) <= 1000),
  status           text not null default 'requested'
                   check (status in ('requested', 'confirmed', 'declined', 'cancelled', 'completed', 'no-show')),
  source           text not null default 'website',
  staff_notes      text
);
create index if not exists reservations_date_idx on public.reservations (booking_date, booking_time);
create index if not exists reservations_status_idx on public.reservations (status);

create table if not exists public.function_enquiries (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text not null,
  phone          text not null,
  email          text not null,
  occasion       text not null,
  preferred_date date,
  guests         integer check (guests is null or guests between 1 and 500),
  message        text not null check (char_length(message) <= 2000),
  status         text not null default 'new' check (status in ('new', 'contacted', 'booked', 'closed')),
  staff_notes    text
);

alter table public.reservations enable row level security;
alter table public.function_enquiries enable row level security;
-- No policies on purpose. Staff view and manage rows in the Supabase dashboard
-- (Table Editor) or a future admin page that uses authenticated staff accounts.
