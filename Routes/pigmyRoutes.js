const express = require("express");
const router = express.Router();
const {
  readData,
  writeData,
  customersFile,
  transactionsFile,
} = require("../Helper/fileHelper");

router.get("/pigmy", (req, res) => {
  res.render("pigmy");
});

router.post("/pigmy", (req, res) => {
  const customers = readData(customersFile);
  const transactions = readData(transactionsFile);
  const { customerId, amount, type } = req.body;
  const timestamp = new Date().toISOString();

  let customer = customers.find((c) => c.customerId === customerId);
  if (!customer) return res.status(404).send("Customer not found");

  const amountValue = parseFloat(amount);
  if (isNaN(amountValue) || amountValue <= 0) {
    return res.status(400).send("Invalid amount entered");
  }

  if (type === "deposit") {
    customer.balance += amountValue;
  } else if (type === "withdrawal") {
    if (customer.balance < amountValue)
      return res.status(400).send("Insufficient balance");
    customer.balance -= amountValue;
  }

  transactions.push({ customerId, amount: amountValue, type, timestamp });
  writeData(customersFile, customers);
  writeData(transactionsFile, transactions);
  res.redirect("/");
});

module.exports = router;
