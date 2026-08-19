const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const gameRouter = require("./routes/gameRouter");
const genreRouter = require("./routes/genreRouter");
const companyRouter = require("./routes/companyRouter");
const app = express();
const assetPaths = path.join(__dirname, "public");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetPaths));
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/games", gameRouter);
app.use("/genres", genreRouter);
app.use("/companies", companyRouter);
const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`hello ${PORT}`);
});
