const pool = require("./pool");

async function getGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}
async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY genre");
  return rows;
}
async function getCompanies() {
  const { rows } = await pool.query("SELECT * FROM companies");
  return rows;
}
async function deleteGame(id) {
  await pool.query(
    `
        DELETE FROM games
        WHERE id = $1
        `,
    [id],
  );
}
async function getGame(id) {
  const { rows: games } = await pool.query(
    "SELECT * FROM games WHERE id = $1",
    [id],
  );

  const { rows: genres } = await pool.query(
    `
        SELECT genres.*
        FROM genres
        JOIN game_genres
            ON genres.id = game_genres.genre_id
        WHERE game_genres.game_id = $1
        `,
    [id],
  );

  const { rows: companies } = await pool.query(
    `
        SELECT companies.*
        FROM companies
        JOIN game_companies
            ON companies.id = game_companies.company_id
        WHERE game_companies.game_id = $1
        `,
    [id],
  );

  return {
    ...games[0],
    genres,
    companies,
  };
}
async function createGame(name, genreIds, companyIds) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "INSERT INTO games (name) VALUES ($1) RETURNING id",
      [name],
    );

    const gameId = rows[0].id;

    for (const genreId of genreIds) {
      await client.query(
        `
                INSERT INTO game_genres (game_id, genre_id)
                VALUES ($1, $2)
                `,
        [gameId, genreId],
      );
    }

    for (const companyId of companyIds) {
      await client.query(
        `
                INSERT INTO game_companies (game_id, company_id)
                VALUES ($1, $2)
                `,
        [gameId, companyId],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
async function getGenre(id) {
  const { rows } = await pool.query(
    `
        SELECT
            genres.id,
            genres.genre,
            games.id AS game_id,
            games.name AS game_name
        FROM genres
        LEFT JOIN game_genres
            ON genres.id = game_genres.genre_id
        LEFT JOIN games
            ON game_genres.game_id = games.id
        WHERE genres.id = $1
        `,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    id: rows[0].id,
    genre: rows[0].genre,
    games: rows
      .filter((row) => row.game_id !== null)
      .map((row) => ({
        id: row.game_id,
        name: row.game_name,
      })),
  };
}
async function deleteGenre(id) {
  await pool.query(
    `
        DELETE FROM genres
        WHERE id = $1
        `,
    [id],
  );
}
async function getCompany(id) {
  const { rows } = await pool.query(
    `
        SELECT
            companies.id,
            companies.company,
            games.id AS game_id,
            games.name AS game_name
        FROM companies
        LEFT JOIN game_companies
            ON companies.id = game_companies.company_id
        LEFT JOIN games
            ON game_companies.game_id = games.id
        WHERE companies.id = $1
        `,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    id: rows[0].id,
    company: rows[0].company,
    games: rows
      .filter((row) => row.game_id !== null)
      .map((row) => ({
        id: row.game_id,
        name: row.game_name,
      })),
  };
}
async function deleteCompany(id) {
  await pool.query(
    `
        DELETE FROM companies
        WHERE id = $1
        `,
    [id],
  );
}
module.exports = {
  getGames,
  getGenres,
  getCompanies,
  createGame,
  getGame,
  deleteGame,
  getGenre,
  deleteGenre,
  getCompany,
  deleteCompany,
};
