-- BarberFlow 3.0 - PostgreSQL / Neon-ready
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug varchar(80) UNIQUE NOT NULL, name varchar(160) NOT NULL,
  phone varchar(40), whatsapp varchar(40), email varchar(180), address text, description text, instagram varchar(120), logo_url text,
  open_time time NOT NULL DEFAULT '09:00', close_time time NOT NULL DEFAULT '19:00', booking_interval int NOT NULL DEFAULT 30,
  cancellation_hours int NOT NULL DEFAULT 2, off_days text[] NOT NULL DEFAULT '{}', theme varchar(20) NOT NULL DEFAULT 'dark',
  qr_color varchar(20) DEFAULT '#0f172a', qr_content text, subscription_status varchar(40) NOT NULL DEFAULT 'trialing',
  timezone varchar(80) NOT NULL DEFAULT 'America/Sao_Paulo', loyalty_enabled boolean NOT NULL DEFAULT false,
  loyalty_target int NOT NULL DEFAULT 10 CHECK (loyalty_target BETWEEN 1 AND 100), loyalty_reward varchar(160),
  stripe_customer_id varchar(120), stripe_subscription_id varchar(120), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name varchar(160) NOT NULL, email varchar(180) NOT NULL, phone varchar(40), password_hash text NOT NULL,
  role varchar(30) NOT NULL CHECK (role IN ('admin','client','platform_admin')), loyalty_points int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), last_visit date, UNIQUE(tenant_id,email)
);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(lower(email));
CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name varchar(160) NOT NULL, role varchar(100) DEFAULT 'Barbeiro', avatar text, specialty varchar(160), active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS professional_working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE, weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL, end_time time NOT NULL, break_start time, break_end time, active boolean NOT NULL DEFAULT true,
  CHECK (start_time < end_time), CHECK ((break_start IS NULL AND break_end IS NULL) OR (break_start IS NOT NULL AND break_end IS NOT NULL AND break_start < break_end)),
  UNIQUE(professional_id,weekday)
);
CREATE INDEX IF NOT EXISTS professional_working_hours_tenant_idx ON professional_working_hours(tenant_id,professional_id,weekday);
CREATE TABLE IF NOT EXISTS professional_time_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE, starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
  reason varchar(200), created_at timestamptz NOT NULL DEFAULT now(), CHECK (starts_at < ends_at)
);
CREATE INDEX IF NOT EXISTS professional_time_off_lookup_idx ON professional_time_off(tenant_id,professional_id,starts_at,ends_at);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name varchar(160) NOT NULL, price numeric(10,2) NOT NULL, duration int NOT NULL DEFAULT 30, description text, image text,
  active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id), professional_id uuid NOT NULL REFERENCES professionals(id), service_id uuid NOT NULL REFERENCES services(id),
  service_price numeric(10,2) NOT NULL, duration int NOT NULL, date date NOT NULL, time time NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_progress','finished','cancelled')),
  payment_method varchar(30), observation text, rating_stars int, rating_comment text, rating_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bookings_schedule_idx ON bookings(tenant_id,professional_id,date,time);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings(tenant_id,user_id,date);
CREATE INDEX IF NOT EXISTS bookings_active_schedule_idx ON bookings(tenant_id,professional_id,date,time) WHERE status IN ('pending','confirmed','in_progress');

-- A conta master é criada pelo endpoint /api/master/bootstrap usando MASTER_BOOTSTRAP_SECRET.
