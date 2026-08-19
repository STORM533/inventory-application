const { body } = require("express-validator");

const gameValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Game name is required.")
    .isLength({ max: 255 })
    .withMessage("Game name must be 255 characters or less."),
  body("genreIds").toArray(),
  body("companyIds").toArray(),
];

module.exports = gameValidator;
