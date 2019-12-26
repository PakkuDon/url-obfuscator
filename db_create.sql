DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS redirects;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

CREATE TABLE links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hash VARCHAR(400),
  link TEXT,
  created_at TIMESTAMP
);

CREATE TABLE redirects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id uuid NOT NULL,
  visited_at TIMESTAMP
);
