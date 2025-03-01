const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = "./data/customers.json";

// Function to read data
const readData = () => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Route to display all transactions
router.get("/transactions", (req, res) => {
  const customers = readData();
  let allTransactions = [];

  customers.forEach((customer) => {
    customer.transactions.forEach((transaction) => {
      allTransactions.push({
        customerId: customer.id,
        name: customer.name,
        accountType: customer.accountType,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
      });
    });
  });

  res.render("transactions", { transactions: allTransactions });
});

module.exports = router;
