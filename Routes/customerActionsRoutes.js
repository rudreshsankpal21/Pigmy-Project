const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/customers.json");

// Function to read customer data
function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  } catch (err) {
    return [];
  }
}

// Function to write customer data
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

// ✅ Route to show update customer form
router.get("/edit-customer/:customerId", (req, res) => {
  const customers = readData();
  const customer = customers.find(
    (c) => c.customerId === req.params.customerId
  );

  if (!customer) {
    return res.redirect(
      "/check-customers?message=Customer not found&type=error"
    );
  }

  res.render("editCustomer", { customer });
});

// ✅ Route to update customer data
router.post("/update-customer", (req, res) => {
  const { customerId, name, number, loanAmount } = req.body;
  let customers = readData();

  const customerIndex = customers.findIndex((c) => c.customerId === customerId);
  if (customerIndex !== -1) {
    customers[customerIndex].name = name;
    customers[customerIndex].number = number;
    customers[customerIndex].loanAmount = parseFloat(loanAmount);
    writeData(customers);
    return res.redirect(
      "/check-customers?message=Customer updated successfully&type=success"
    );
  }

  res.redirect("/check-customers?message=Customer not found&type=error");
});

// ✅ Route to delete a customer
router.post("/delete-customer", (req, res) => {
  const { customerId } = req.body;
  let customers = readData();

  const filteredCustomers = customers.filter(
    (c) => c.customerId !== customerId
  );

  if (filteredCustomers.length === customers.length) {
    return res.redirect(
      "/check-customers?message=Customer not found&type=error"
    );
  }

  writeData(filteredCustomers);
  res.redirect(
    "/check-customers?message=Customer deleted successfully&type=success"
  );
});

module.exports = router;
