const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = "./data/customers.json";
const { readData, customersFile } = require("../Helper/fileHelper");

// Function to write data
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Route to render Add Customer page
router.get("/add-customer", (req, res) => {
  res.render("addCustomer");
});

// Route to add a new customer
router.post("/add-customer", (req, res) => {
  const { name, customerId, phone, accountType, loanAmount } = req.body;
  let customers = readData();

  const newCustomer = {
    id: customerId,
    name,
    phone,
    accountType,
    balance: accountType === "savings" ? 0 : parseFloat(loanAmount),
    transactions: [],
  };

  customers.push(newCustomer);
  writeData(customers);
  res.redirect("/check");
});

// Route to handle deposits and withdrawals
router.post("/transaction", (req, res) => {
  const { customerId, amount, type } = req.body;
  let customers = readData();
  const customerIndex = customers.findIndex((c) => c.id === customerId);

  if (customerIndex !== -1) {
    let customer = customers[customerIndex];
    let transactionAmount = parseFloat(amount);

    if (customer.accountType === "savings") {
      if (type === "deposit") {
        customer.balance += transactionAmount;
      } else if (type === "withdraw" && customer.balance >= transactionAmount) {
        customer.balance -= transactionAmount;
      }
    } else if (customer.accountType === "loan") {
      if (type === "deposit") {
        customer.balance = Math.max(0, customer.balance - transactionAmount);
      }
    }

    customer.transactions.push({
      type,
      amount: transactionAmount,
      date: new Date().toISOString(),
    });
    customers[customerIndex] = customer;
    writeData(customers);
  }
  res.redirect("/check");
});

// Route to render edit customer page
router.get("/edit-customer/:customerId", (req, res) => {
  const customers = readData();
  const customer = customers.find((c) => c.id === req.params.customerId);

  if (!customer) {
    return res.send("Customer not found");
  }

  res.render("editCustomer", { customer });
});

// Route to update a customer
router.post("/update-customer", (req, res) => {
  const { customerId, name, phone } = req.body;
  let customers = readData();
  const customerIndex = customers.findIndex((c) => c.id === customerId);

  if (customerIndex !== -1) {
    customers[customerIndex].name = name;
    customers[customerIndex].phone = phone;
    writeData(customers);
    res.redirect("/check");
  } else {
    res.send("Customer not found");
  }
});

// Route to delete a customer
router.post("/delete-customer", (req, res) => {
  const { customerId } = req.body;
  let customers = readData().filter((c) => c.id !== customerId);
  writeData(customers);
  res.redirect("/check");
});

// Route to display customers
router.get("/check", (req, res) => {
  const customers = readData();
  res.render("check", { customers });
});

// Route to render Get Customer Info page
router.get("/get-customer-info", (req, res) => {
  res.render("getCustomerInfo", { customer: null, error: null });
});

// Route to handle form submission and get customer info
router.post("/get-customer-info", (req, res) => {
  const { customerId } = req.body;
  const customers = readData(customersFile);
  const customer = customers.find((c) => c.id === customerId); // Adjust based on your customer ID field

  if (customer) {
    res.render("getCustomerInfo", { customer, error: null });
  } else {
    res.render("getCustomerInfo", {
      customer: null,
      error: "Customer not found.",
    });
  }
});

module.exports = router;
