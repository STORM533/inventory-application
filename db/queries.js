const pool = require("./pool");

async function getGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}
async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
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

module.exports = {
  getGames,
  getGenres,
  getCompanies,
  createGame,
  getGame,
  deleteGame,
};
