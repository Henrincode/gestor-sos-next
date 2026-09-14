```sql
-- ==========================================
-- 1. ESTRUTURA DAS TABELAS
-- ==========================================

-- 1. Tabela de Usuários
CREATE TABLE sos_users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 2. Tokens de Usuário (Sessão / Autenticação)
CREATE TABLE sos_user_tokens (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 3. E-mails de Usuário (Permite múltiplos e-mails por conta)
CREATE TABLE sos_user_emails (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- Unicidade parcial: garante que e-mails ativos sejam únicos (compatível com Soft Delete)
-- CREATE UNIQUE INDEX idx_sos_user_emails_active ON sos_user_emails(email) WHERE deleted_at IS NULL;

-- Unicidade parcial: garante no máximo 1 e-mail principal ativo por usuário
CREATE UNIQUE INDEX idx_sos_user_primary_email ON sos_user_emails(user_id) WHERE is_primary = TRUE AND deleted_at IS NULL;

-- 4. Empresas (Multi-tenant)
CREATE TABLE sos_companies (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 5. Nível 1: Permissões do Usuário na Empresa (Escopo Administrativo/Conta)
CREATE TABLE sos_company_user_permissions (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- 6. Nível 2: Permissões de OS na Empresa (Escopo Operacional Global)
CREATE TABLE sos_company_order_permissions (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- 7. Vínculo Usuário <-> Empresa (Junction Table com Permissões do Sistema e do Fluxo de OS)
CREATE TABLE sos_company_users (
  company_id INT NOT NULL REFERENCES sos_companies(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE,
  company_permission_id INT NOT NULL REFERENCES sos_company_user_permissions(id),
  order_permission_id INT NOT NULL REFERENCES sos_company_order_permissions(id),
  PRIMARY KEY (company_id, user_id)
);

-- 8. Locais da Empresa (Hierárquico / Prédios, Setores, Salões)
CREATE TABLE sos_company_locations (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id INT NOT NULL REFERENCES sos_companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  parent_id INT NULL REFERENCES sos_company_locations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Status da Ordem de Serviço
CREATE TABLE sos_order_statuses (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- 10. Prioridades da Ordem de Serviço
CREATE TABLE sos_order_priorities (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- 11. Ordens de Serviço
CREATE TABLE sos_orders (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id INT NOT NULL REFERENCES sos_companies(id) ON DELETE CASCADE,
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

-- 12. Nível 3: Papéis do Usuário em uma Ordem de Serviço Específica (Escopo Pontual)
CREATE TABLE sos_order_user_roles (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- 13. Vínculo Usuários <-> Ordem de Serviço (Junction Table Pontual)
CREATE TABLE sos_order_users (
  order_id INT NOT NULL REFERENCES sos_orders(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES sos_order_user_roles(id),
  PRIMARY KEY (order_id, user_id, role_id)
);

-- 14. Fotos da Ordem de Serviço
CREATE TABLE sos_order_photos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id INT NOT NULL REFERENCES sos_orders(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 15. Atualizações da Ordem de Serviço (Histórico / Comentários)
CREATE TABLE sos_order_updates (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id INT NOT NULL REFERENCES sos_orders(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES sos_users(id),
  previous_id INT NULL REFERENCES sos_order_updates(id) ON DELETE SET NULL, -- Suporte a histórico encadeado
  title VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 16. Fotos das Atualizações
CREATE TABLE sos_order_update_photos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_update_id INT NOT NULL REFERENCES sos_order_updates(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- ==========================================
-- 2. ÍNDICES DE DESEMPENHO
-- ==========================================

-- CREATE INDEX idx_sos_orders_company_status ON sos_orders(company_id, status_id) WHERE deleted_at IS NULL;
-- CREATE INDEX idx_sos_order_updates_order ON sos_order_updates(order_id) WHERE deleted_at IS NULL;
-- CREATE INDEX idx_sos_company_users_user ON sos_company_users(user_id);

-- ==========================================
-- 3. POPULAÇÃO INICIAL DE LOOKUPS
-- ==========================================

-- Permissões de Usuário na Empresa (Escopo Administrativo / Conta)
INSERT INTO sos_company_user_permissions (name) VALUES 
  ('Administrador'), -- Nível Máximo: Gestão da conta, faturamento, configurações e convites.
  ('Usuário');       -- Nível Padrão: Acesso comum do dia a dia.

-- Permissões de OS na Empresa (Escopo Operacional Global)
INSERT INTO sos_company_order_permissions (name) VALUES 
  ('Administrador'), -- Nível 1: Gestão total de OSs; cria, edita, deleta qualquer OS e comentário da empresa.
  ('Gerente'),       -- Nível 2: Gestão operacional; vê todas as OSs, reatribui responsáveis e altera prazos.
  ('Operador'),      -- Nível 3: Triagem e Execução; visualiza fluxo de OSs, assume chamados e atualiza andamentos.
  ('Solicitante');   -- Nível 4: Usuário final; abre chamados e acompanha apenas os seus próprios.

-- Papéis do Usuário na Ordem de Serviço (Escopo Pontual da OS)
INSERT INTO sos_order_user_roles (name) VALUES
  ('Solicitante'),   -- Quem reportou a necessidade ou abriu esta OS específica.
  ('Responsável'),   -- Técnico/Executante encarregado de realizar o serviço desta OS.
  ('Observador');    -- Gestor ou interessado que acompanha o progresso e notificações desta OS.

-- Estados do ciclo de vida de uma Ordem de Serviço
INSERT INTO sos_order_statuses (name) VALUES 
  ('Pendente'),      -- Criado, aguardando triagem ou início de atendimento.
  ('Em progresso'),  -- Em execução pelo responsável.
  ('Completado'),    -- Serviço concluído com sucesso.
  ('Cancelado');     -- Encerrado sem a realização do serviço.

-- Níveis de urgência e priorização de atendimento (SLA)
INSERT INTO sos_order_priorities (name) VALUES 
  ('Baixa'),        -- Manutenções preventivas ou ajustes sem impacto imediato.
  ('Média'),        -- Falhas pontuais que não paralisam a operação.
  ('Alta'),         -- Problemas graves com risco de interrupção operacional.
  ('Urgente');      -- Emergência/Parada total; exige atendimento imediato.
```