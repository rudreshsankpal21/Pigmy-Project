const express = require("express");
const app = express();
const path = require("path");
const ejsLayout = require("express-ejs-layouts");
const session = require("express-session");

const homeRoutes = require("./Routes/homeRoutes");
const customerRoutes = require("./Routes/customerRoutes");
const pigmyRoutes = require("./Routes/pigmyRoutes");
const checkRoutes = require("./Routes/checkRoutes");
const customerActionsRoutes = require("./Routes/customerActionsRoutes");
const transactionRoutes = require("./Routes/transactionRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayout);
app.set("layout", "layouts/main");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRoutes);
app.use("/", customerRoutes);
app.use("/", pigmyRoutes);
app.use("/", checkRoutes);
app.use("/", customerActionsRoutes);
app.use("/", transactionRoutes);

app.use(
  session({
    secret: "123", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
