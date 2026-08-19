const { Router } = require("express");
const gameRouter = Router();
const gameController = require("../controllers/indexController");

indexRouter.get("/game", indexController.getGames);
indexRouter.get("/new", indexController.getForm);
indexRouter.post("/new", indexController.addGames);
module.exports = indexRouter;
