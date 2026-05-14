-- SQL to create the audits table in Supabase

CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  team_size INTEGER,
  use_case TEXT,
  total_cost NUMERIC,
  potential_savings NUMERIC,
  recommendations JSONB,
  is_eligible BOOLEAN,
  summary TEXT
);
