CREATE TABLE IF NOT EXISTS trends (
  id              SERIAL PRIMARY KEY,
  korean_name     TEXT NOT NULL,
  english_name    TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  first_seen_at   DATE NOT NULL,
  last_seen_at    DATE NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  rank            INTEGER,
  volume_score    INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trend_snapshots (
  id          SERIAL PRIMARY KEY,
  trend_id    INTEGER REFERENCES trends(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  volume      INTEGER NOT NULL,
  UNIQUE(trend_id, date)
);

CREATE OR REPLACE VIEW trends_with_days AS
SELECT
  t.*,
  (CURRENT_DATE - t.first_seen_at) AS days_trending
FROM trends t
WHERE t.is_active = true
ORDER BY t.rank ASC;
