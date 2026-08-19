const db = require("../db/queries");
const getGenres = async (req, res) => {
  const genres = await db.getGenres();
  res.render("genres/index", { genres });
};

const getGenre = async (req, res) => {
  const genre = await db.getGenre(req.params.id);
  res.render("genres/show", { genre });
};

const deleteGenre = async (req, res) => {
  await db.deleteGenre(req.params.id);
  res.redirect("/genres");
};

module.exports = {
  getGenres,
  getGenre,
  deleteGenre,
};
