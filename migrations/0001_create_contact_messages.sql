CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  ip_hash TEXT,
  origin TEXT,
  user_agent TEXT,
  source TEXT NOT NULL DEFAULT 'portfolio',
  delivery_status TEXT NOT NULL DEFAULT 'received',
  email_status TEXT NOT NULL DEFAULT 'pending',
  provider_message_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_messages (email);
CREATE INDEX IF NOT EXISTS idx_contact_ip_hash_created ON contact_messages (ip_hash, created_at DESC);
