CREATE TABLE links (id TEXT NOT NULL PRIMARY KEY, url_path TEXT, title TEXT, inserted_dts DATETIME);

CREATE TABLE tags (id TEXT NOT NULL PRIMARY KEY, tag_name TEXT);

CREATE TABLE link_tags (link_id TEXT REFERENCES links (id), tag_id TEXT REFERENCES tags (id));
