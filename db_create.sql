DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS redirects;

CREATE TABLE links (
  id SERIAL4 PRIMARY KEY,
  hash VARCHAR(400),
  link TEXT,
  created_at TIMESTAMP
);

CREATE TABLE redirects (
  id SERIAL4 PRIMARY KEY,
  link_id SERIAL4 NOT NULL,
  visited_at TIMESTAMP
);
