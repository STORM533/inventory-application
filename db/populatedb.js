#! /usr/bin/env node
const dotenv = require("dotenv");
const { Client } = require("pg");
dotenv.config();

const SQL = `
DROP TABLE IF EXISTS game_companies;
DROP TABLE IF EXISTS game_genres;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS games;

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre TEXT
);
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company TEXT
);

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS game_genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    UNIQUE(game_id,genre_id)
);
CREATE TABLE IF NOT EXISTS game_companies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE (game_id,company_id)
);
INSERT INTO genres (genre) VALUES
    ('RPG'), ('Action'), ('Action RPG'), ('Soulslike'), ('Open World'),
    ('Action-Adventure'), ('Western'), ('FPS'), ('Turn-Based Strategy'),
    ('CRPG'), ('Metroidvania'), ('Platformer'), ('Hack and Slash'),
    ('Character Action'), ('Survival Horror'), ('Third-Person Shooter'),
    ('Roguelike'), ('MMO'), ('Looter Shooter'), ('Puzzle'), ('First-Person'),
    ('Sci-Fi'), ('Walking Sim'), ('Stealth'), ('Dungeon Crawler'),
    ('Detective'), ('Visual Novel');

INSERT INTO companies (company) VALUES
    ('FromSoftware'), ('Bandai Namco'), ('Rockstar Games'), ('Rockstar San Diego'),
    ('CD Projekt Red'), ('Larian Studios'), ('Team Cherry'), ('Santa Monica Studio'),
    ('Sony Interactive Entertainment'), ('Capcom'), ('Blizzard Entertainment'),
    ('Bungie'), ('Activision'), ('Valve'), ('Kojima Productions'),
    ('Supergiant Games'), ('ZA/UM');

INSERT INTO games (name) VALUES
    ('Elden Ring'),
    ('Red Dead Redemption 2'),
    ('Cyberpunk 2077'),
    ('The Witcher 3'),
    ('Sekiro: Shadows Die Twice'),
    ('Baldur''s Gate 3'),
    ('Hollow Knight'),
    ('God of War Ragnarök'),
    ('Devil May Cry 5'),
    ('Resident Evil 4 Remake'),
    ('Diablo 4'),
    ('Divinity: Original Sin 2'),
    ('Destiny 2'),
    ('Portal 2'),
    ('Death Stranding'),
    ('Hades'),
    ('Disco Elysium');

INSERT INTO game_genres (game_id, genre_id)
SELECT g.id, ge.id FROM games g, genres ge
WHERE (g.name, ge.genre) IN (
    ('Elden Ring', 'Action RPG'), ('Elden Ring', 'Soulslike'), ('Elden Ring', 'Open World'),
    ('Red Dead Redemption 2', 'Action-Adventure'), ('Red Dead Redemption 2', 'Open World'), ('Red Dead Redemption 2', 'Western'),
    ('Cyberpunk 2077', 'RPG'), ('Cyberpunk 2077', 'Action'), ('Cyberpunk 2077', 'FPS'),
    ('The Witcher 3', 'RPG'), ('The Witcher 3', 'Action-Adventure'), ('The Witcher 3', 'Open World'),
    ('Sekiro: Shadows Die Twice', 'Soulslike'), ('Sekiro: Shadows Die Twice', 'Action'), ('Sekiro: Shadows Die Twice', 'Stealth'),
    ('Baldur''s Gate 3', 'RPG'), ('Baldur''s Gate 3', 'Turn-Based Strategy'), ('Baldur''s Gate 3', 'CRPG'),
    ('Hollow Knight', 'Metroidvania'), ('Hollow Knight', 'Platformer'), ('Hollow Knight', 'Action'),
    ('God of War Ragnarök', 'Action-Adventure'), ('God of War Ragnarök', 'Hack and Slash'),
    ('Devil May Cry 5', 'Hack and Slash'), ('Devil May Cry 5', 'Character Action'),
    ('Resident Evil 4 Remake', 'Survival Horror'), ('Resident Evil 4 Remake', 'Action'), ('Resident Evil 4 Remake', 'Third-Person Shooter'),
    ('Diablo 4', 'Action RPG'), ('Diablo 4', 'Hack and Slash'), ('Diablo 4', 'Roguelike'),
    ('Divinity: Original Sin 2', 'RPG'), ('Divinity: Original Sin 2', 'Turn-Based Strategy'), ('Divinity: Original Sin 2', 'CRPG'),
    ('Destiny 2', 'FPS'), ('Destiny 2', 'MMO'), ('Destiny 2', 'Looter Shooter'),
    ('Portal 2', 'Puzzle'), ('Portal 2', 'First-Person'), ('Portal 2', 'Sci-Fi'),
    ('Death Stranding', 'Action'), ('Death Stranding', 'Walking Sim'), ('Death Stranding', 'Stealth'),
    ('Hades', 'Roguelike'), ('Hades', 'Action'), ('Hades', 'Dungeon Crawler'),
    ('Disco Elysium', 'RPG'), ('Disco Elysium', 'Detective'), ('Disco Elysium', 'Visual Novel')
);
INSERT INTO game_companies (game_id, company_id)
SELECT g.id, c.id FROM games g, companies c
WHERE (g.name, c.company) IN (
    ('Elden Ring', 'FromSoftware'), ('Elden Ring', 'Bandai Namco'),
    ('Red Dead Redemption 2', 'Rockstar Games'), ('Red Dead Redemption 2', 'Rockstar San Diego'),
    ('Cyberpunk 2077', 'CD Projekt Red'),
    ('The Witcher 3', 'CD Projekt Red'),
    ('Sekiro: Shadows Die Twice', 'FromSoftware'), ('Sekiro: Shadows Die Twice', 'Activision'),
    ('Baldur''s Gate 3', 'Larian Studios'),
    ('Hollow Knight', 'Team Cherry'),
    ('God of War Ragnarök', 'Santa Monica Studio'), ('God of War Ragnarök', 'Sony Interactive Entertainment'),
    ('Devil May Cry 5', 'Capcom'),
    ('Resident Evil 4 Remake', 'Capcom'),
    ('Diablo 4', 'Blizzard Entertainment'),
    ('Divinity: Original Sin 2', 'Larian Studios'),
    ('Destiny 2', 'Bungie'), ('Destiny 2', 'Activision'),
    ('Portal 2', 'Valve'),
    ('Death Stranding', 'Kojima Productions'), ('Death Stranding', 'Sony Interactive Entertainment'),
    ('Hades', 'Supergiant Games'),
    ('Disco Elysium', 'ZA/UM')
);
`;

async function main() {
  console.log("seeding...");
  const databaseURL =
    process.argv[2] === "production"
      ? process.env.PRODUCTION_DATABASE_URL
      : process.env.DATABASE_URL;
  const client = new Client({
    connectionString: databaseURL,
    ssl:
      process.argv[2] === "production" ? { rejectUnauthorized: false } : false,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
