#! /usr/bin/env node
const dotenv = require("dotenv");
const { Client } = require("pg");
dotenv.config();

const SQL = `
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
    name VARCHAR(255),
    genre_id INTEGER REFERENCES genres(id),
    company_id INTEGER REFERENCES companies(id)
);

INSERT INTO genres (genre)
    VALUES ('RPG'), ('Hack and Slash'), ('Soulslike'), ('metroidvania');

INSERT INTO companies (company)
    VALUES ('rockstar'), ('Team Cherry'), ('Fromsoftware'), ('Nintendo'), ('Capcom');

INSERT INTO games (name, genre_id, company_id)
    VALUES
        ('Dark Souls 3', 3, 3),
        ('GTA 5', 1, 1),
        ('The Legend of Zelda', 1, 4),
        ('Hollow Knight: Silksong', 4, 2),
        ('Devil May Cry 5', 2, 5),  
        ('Hollow Knight', 4, 2);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
