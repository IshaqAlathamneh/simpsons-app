DROP TABLE IF EXISTS chara;
CREATE TABLE IF NOT EXISTS chara (
    id SERIAL NOT NULL,
    name VARCHAR(256),
    quote TEXT,
    image VARCHAR(256),
    direction VARCHAR(50)
);