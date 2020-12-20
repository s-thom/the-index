-- Must wipe existing data. I know I should avoid this, but this hasn't
-- actually gone to a production env yet, so it doesn't really matter.
DELETE FROM link_tags;
DELETE FROM tags;
DELETE FROM links;

CREATE TABLE users (id TEXT NOT NULL PRIMARY KEY, user_name TEXT, created_dts DATETIME DEFAULT CUTTENT_TIMESTAMP);

ALTER TABLE links ADD COLUMN user_id TEXT NOT NULL DEFAULT '' REFERENCES users (id);

DELETE FROM links WHERE user_id = '';
