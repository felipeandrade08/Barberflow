-- Package 5: billing provider neutralization and production constraints
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS billing_provider varchar(30) NOT NULL DEFAULT 'mercado_pago',
  ADD COLUMN IF NOT EXISTS billing_customer_id varchar(160),
  ADD COLUMN IF NOT EXISTS billing_subscription_id varchar(160);

UPDATE tenants SET billing_customer_id=COALESCE(billing_customer_id,stripe_customer_id),billing_subscription_id=COALESCE(billing_subscription_id,stripe_subscription_id) WHERE stripe_customer_id IS NOT NULL OR stripe_subscription_id IS NOT NULL;

DO $$
BEGIN
 ALTER TABLE services DROP CONSTRAINT IF EXISTS services_price_positive;
 ALTER TABLE services ADD CONSTRAINT services_price_positive CHECK (price >= 0);
 ALTER TABLE services DROP CONSTRAINT IF EXISTS services_duration_positive;
 ALTER TABLE services ADD CONSTRAINT services_duration_positive CHECK (duration BETWEEN 5 AND 1440);
 ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_rating_range;
 ALTER TABLE bookings ADD CONSTRAINT bookings_rating_range CHECK (rating_stars IS NULL OR rating_stars BETWEEN 1 AND 5);
 ALTER TABLE tenants DROP CONSTRAINT IF EXISTS tenants_booking_interval_range;
 ALTER TABLE tenants ADD CONSTRAINT tenants_booking_interval_range CHECK (booking_interval BETWEEN 5 AND 240);
END $$;

ALTER TABLE tenants DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE tenants DROP COLUMN IF EXISTS stripe_subscription_id;
