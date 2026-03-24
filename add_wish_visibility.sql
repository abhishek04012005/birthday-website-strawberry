ALTER TABLE wishes ADD COLUMN is_visible BOOLEAN DEFAULT false;
ALTER TABLE wishes RENAME COLUMN wish TO wish_text;
ALTER TABLE wishes RENAME COLUMN created_at TO submitted_at;
