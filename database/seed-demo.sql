-- Rode depois do schema se quiser uma barbearia de demonstração.
INSERT INTO tenants(slug,name,email,phone,whatsapp,address,description,instagram,subscription_status)
VALUES('barbearia-demo','Barbearia Demo','contato@demo.local','(14) 99999-0000','5514999990000','Centro','Uma experiência premium de barbearia.','@barbeariademo','active')
ON CONFLICT(slug) DO NOTHING;
INSERT INTO professionals(tenant_id,name,role,specialty,active)
SELECT id,'Carlos Almeida','Barbeiro','Cortes clássicos e modernos',true FROM tenants WHERE slug='barbearia-demo' AND NOT EXISTS (SELECT 1 FROM professionals p WHERE p.tenant_id=tenants.id);
INSERT INTO services(tenant_id,name,price,duration,description,active)
SELECT id,'Corte Masculino',45,45,'Corte completo com acabamento.',true FROM tenants WHERE slug='barbearia-demo' AND NOT EXISTS (SELECT 1 FROM services s WHERE s.tenant_id=tenants.id);
