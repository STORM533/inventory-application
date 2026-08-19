const DELETE_PASSWORD = "STORM";

const deletePassword = (req, res, next) => {
  if (req.body.deletePassword !== DELETE_PASSWORD) {
    return res.status(403).render("deleteError");
  }

  next();
};

module.exports = deletePassword;
