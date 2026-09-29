-- Package 2: operational booking lifecycle
DO $$
BEGIN
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
  ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
    CHECK (status IN ('pending','confirmed','in_progress','finished','cancelled'));
END $$;

DROP INDEX IF EXISTS bookings_active_schedule_idx;
CREATE INDEX bookings_active_schedule_idx
  ON bookings(tenant_id,professional_id,date,time)
  WHERE status IN ('pending','confirmed','in_progress');
