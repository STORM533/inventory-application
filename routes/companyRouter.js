const { Router } = require("express");
const companyRouter = Router();
const companyController = require("../controllers/companyController");
companyRouter.get("/", companyController.getCompanies);
companyRouter.get("/:id", companyController.getCompany);
companyRouter.post("/:id/delete", companyController.deleteCompany);

module.exports = companyRouter;
