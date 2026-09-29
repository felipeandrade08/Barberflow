-- Package 7: public booking portal, barber role, service combos and platform support
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS cover_url text;

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS category varchar(80) NOT NULL DEFAULT 'Outros',
  ADD COLUMN IF NOT EXISTS is_combo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS combo_items text[] NOT NULL DEFAULT '{}';

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin','barber','client','platform_admin'));

ALTER TABLE professionals
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS professionals_user_idx
  ON professionals(user_id) WHERE user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS platform_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  support_email varchar(180),
  support_whatsapp varchar(40),
  support_message text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO platform_settings(id,support_message)
VALUES (1,'Precisa de ajuda com o BarberFlow? Fale com o suporte da plataforma.')
ON CONFLICT (id) DO NOTHING;
