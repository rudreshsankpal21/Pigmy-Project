const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/customers.json");

// Function to read data
function readData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return []; // Returns the empty array if the file does not exist
    }
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

// Function to write data
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

// Export functions
module.exports = { readData, writeData };
