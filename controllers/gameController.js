const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const gameValidator = require("../middleware/validator");

const getGames = async (req, res) => {
  const games = await db.getGames();
  res.render("games/index", { games });
};

const getGameForm = async (req, res) => {
  const genres = await db.getGenres();
  const companies = await db.getCompanies();
  res.render("games/new", { genres, companies });
};

const postGameForm = [
  gameValidator,

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const genres = await db.getGenres();
      const companies = await db.getCompanies();
      return res.status(400).render("games/new", {
        genres,
        companies,
        errors: errors.array(),
      });
    }
    const { name, genreIds, companyIds } = matchedData(req);
    await db.createGame(name, genreIds, companyIds);
    res.redirect("/games");
  },
];

const deleteGame = async (req, res) => {
  await db.deleteGame(req.params.id);
  res.redirect("/games");
};

const getGame = async (req, res) => {
  const game = await db.getGame(req.params.id);
  res.render("games/show", { game });
};
module.exports = {
  getGames,
  getGameForm,
  postGameForm,
  deleteGame,
  getGame,
};
