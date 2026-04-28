-- V1 minimal schema for frozen six APIs
CREATE SEQUENCE IF NOT EXISTS anon_seq START 1;
CREATE SEQUENCE IF NOT EXISTS session_seq START 1;
CREATE SEQUENCE IF NOT EXISTS task_seq START 1;
CREATE SEQUENCE IF NOT EXISTS report_seq START 1;

CREATE TABLE IF NOT EXISTS users (
  anonymous_id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE,
  token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  anonymous_id TEXT NOT NULL REFERENCES users(anonymous_id),
  user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  task_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(session_id),
  anonymous_id TEXT NOT NULL REFERENCES users(anonymous_id),
  user_id TEXT,
  profile_json JSONB NOT NULL,
  state TEXT NOT NULL,
  error_message TEXT,
  report_id TEXT,
  should_fail BOOLEAN NOT NULL DEFAULT FALSE,
  poll_count INTEGER NOT NULL DEFAULT 0,
  transitions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  report_id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(task_id),
  anonymous_id TEXT NOT NULL REFERENCES users(anonymous_id),
  user_id TEXT,
  detail_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS binds (
  anonymous_id TEXT PRIMARY KEY REFERENCES users(anonymous_id),
  user_id TEXT NOT NULL,
  login_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_anonymous_id ON sessions(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_tasks_session_id ON tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_tasks_state ON tasks(state);
CREATE INDEX IF NOT EXISTS idx_reports_task_id ON reports(task_id);
