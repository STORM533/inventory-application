const db = require("../db/queries");

const getCompanies = async (req, res) => {
  const companies = await db.getCompanies();
  res.render("companies/index", { companies });
};

const getCompany = async (req, res) => {
  const company = await db.getCompany(req.params.id);
  res.render("companies/show", { company });
};

const deleteCompany = async (req, res) => {
  await db.deleteCompany(req.params.id);
  res.redirect("/companies");
};

module.exports = {
  getCompanies,
  getCompany,
  deleteCompany,
};
