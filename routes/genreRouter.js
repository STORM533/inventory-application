const { Router } = require("express");
const genreRouter = Router();
const genreController = require("../controllers/genreController");
const deletePassword = require("../middleware/deletePassword");
genreRouter.get("/", genreController.getGenres);
genreRouter.get("/:id", genreController.getGenre);
genreRouter.post("/:id/delete", deletePassword, genreController.deleteGenre);
module.exports = genreRouter;
