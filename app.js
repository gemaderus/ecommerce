const express = require("express");
const path = require("path");
const expresHbs = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const bodyParser = require("body-parser");

const app = express();

app.engine(
  "hbs",
  expresHbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found" });
});

app.listen(8080);
