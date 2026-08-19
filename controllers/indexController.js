const db = require("../db/queries");

const welcome = (req, res) => {
  res.render("index");
};
module.exports = {
  welcome,
};
