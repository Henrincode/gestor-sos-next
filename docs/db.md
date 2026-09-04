```sql
-- 1. Tabela de Usuários
CREATE TABLE sos_users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 2. Tokens de Usuário
CREATE TABLE sos_user_tokens (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. E-mails de Usuário
CREATE TABLE sos_user_emails (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 4. Empresas
CREATE TABLE sos_companies (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tipos de Permissão de Usuário na Empresa
CREATE TABLE sos_company_user_permissions (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type VARCHAR(255) NOT NULL UNIQUE
);

-- 6. Vínculo Usuário <-> Empresa (Junction)
CREATE TABLE sos_company_users (
  company_id INT NOT NULL REFERENCES sos_companies(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE,
  permission_id INT NOT NULL REFERENCES sos_company_user_permissions(id),
  PRIMARY KEY (company_id, user_id)
);

-- 7. Locais da Empresa (Hierárquico)
CREATE TABLE sos_company_locations (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id INT NOT NULL REFERENCES sos_companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  parent_id INT NULL REFERENCES sos_company_locations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Status da Ordem de Serviço
CREATE TABLE sos_order_statuses (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- 9. Prioridades da Ordem de Serviço
CREATE TABLE sos_order_priorities (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- 10. Ordens de Serviço
CREATE TABLE sos_orders (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id INT NOT NULL REFERENCES sos_companies(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES sos_users(id), -- Solicitante
  location_id INT NOT NULL REFERENCES sos_company_locations(id),
  priority_id INT NOT NULL REFERENCES sos_order_priorities(id),
  status_id INT NOT NULL REFERENCES sos_order_statuses(id),
  title VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  icon VARCHAR(255) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL,
  completed_at TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL
);

-- 11. Responsáveis pela Ordem de Serviço (Junction)
CREATE TABLE sos_order_assignees (
  order_id INT NOT NULL REFERENCES sos_orders(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE,
  PRIMARY KEY (order_id, user_id)
);

-- 12. Fotos da Ordem de Serviço
CREATE TABLE sos_order_photos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id INT NOT NULL REFERENCES sos_orders(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Atualizações da Ordem de Serviço
CREATE TABLE sos_order_updates (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id INT NOT NULL REFERENCES sos_orders(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES sos_users(id),
  previous_id INT NULL REFERENCES sos_order_updates(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 14. Fotos das Atualizações
CREATE TABLE sos_order_update_photos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_update_id INT NOT NULL REFERENCES sos_order_updates(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- POPULAÇÃO INICIAL DE LOOKUPS (OPCIONAL)
-- ==========================================

INSERT INTO sos_company_user_permissions (type) VALUES 
  ('Leitura'), ('Escrita'), ('Apagar'), ('Administrador');

INSERT INTO sos_order_statuses (name) VALUES 
  ('Pendente'), ('Em progresso'), ('Completado'), ('Cancelado');

INSERT INTO sos_order_priorities (name) VALUES 
  ('Baixa'), ('Média'), ('Alta'), ('Urgente');
```