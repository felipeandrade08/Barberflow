-- Package 3: timezone, professional schedules and configurable loyalty
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS timezone varchar(80) NOT NULL DEFAULT 'America/Sao_Paulo',
  ADD COLUMN IF NOT EXISTS loyalty_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS loyalty_target int NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS loyalty_reward varchar(160);

DO $$
BEGIN
  ALTER TABLE tenants DROP CONSTRAINT IF EXISTS tenants_loyalty_target_check;
  ALTER TABLE tenants ADD CONSTRAINT tenants_loyalty_target_check CHECK (loyalty_target BETWEEN 1 AND 100);
END $$;

CREATE TABLE IF NOT EXISTS professional_working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_start time,
  break_end time,
  active boolean NOT NULL DEFAULT true,
  CHECK (start_time < end_time),
  CHECK ((break_start IS NULL AND break_end IS NULL) OR (break_start IS NOT NULL AND break_end IS NOT NULL AND break_start < break_end)),
  UNIQUE(professional_id,weekday)
);
CREATE INDEX IF NOT EXISTS professional_working_hours_tenant_idx ON professional_working_hours(tenant_id,professional_id,weekday);

CREATE TABLE IF NOT EXISTS professional_time_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  reason varchar(200),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (starts_at < ends_at)
);
CREATE INDEX IF NOT EXISTS professional_time_off_lookup_idx ON professional_time_off(tenant_id,professional_id,starts_at,ends_at);
