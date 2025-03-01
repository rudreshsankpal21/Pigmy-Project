const express = require("express");
const router = express.Router();
const {
  readData,
  customersFile,
  transactionsFile,
} = require("../Helper/fileHelper");

router.get("/check", (req, res) => {
  const customers = readData(customersFile);
  const transactions = readData(transactionsFile);
  res.render("check", { customers, transactions });
});

module.exports = router;
