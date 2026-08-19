const { Router } = require("express");
const gameRouter = Router();
const gameController = require("../controllers/gameController");

gameRouter.get("/", gameController.getGames);
gameRouter.get("/new", gameController.getGameForm);
gameRouter.post("/new", gameController.postGameForm);
gameRouter.get("/:id", gameController.getGame);
gameRouter.post("/:id/delete", gameController.deleteGame);
module.exports = gameRouter;
