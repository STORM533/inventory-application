const { Router } = require("express");
const companyRouter = Router();
const companyController = require("../controllers/companyController");
const deletePassword = require("../middleware/deletePassword");
companyRouter.get("/", companyController.getCompanies);
companyRouter.get("/:id", companyController.getCompany);
companyRouter.post(
  "/:id/delete",
  deletePassword,
  companyController.deleteCompany,
);

module.exports = companyRouter;
