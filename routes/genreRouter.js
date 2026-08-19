const { Router } = require("express");
const genreRouter = Router();
const genreController = require("../controllers/genreController");
genreRouter.get("/", genreController.getGenres);
genreRouter.get("/:id", genreController.getGenre);
genreRouter.post("/:id/delete", genreController.deleteGenre);
module.exports = genreRouter;
