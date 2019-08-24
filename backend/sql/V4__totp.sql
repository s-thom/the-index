CREATE TABLE auth_methods (name TEXT PRIMARY KEY NOT NULL, description TEXT);

CREATE TABLE user_authentication (
  user_id TEXT NOT NULL REFERENCES users (id),
  auth_method TEXT NOT NULL REFERENCES auth_methods (name),
  auth_secret TEXT
);

INSERT INTO auth_methods VALUES ('totp', 'Time-based One Time Password');
