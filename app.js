const express = require("express");
const path = require("path");
const expresHbs = require("express-handlebars");
const productsController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;

const User = require("./models/user");

const adminRoutes = require("./routes/admin");
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
// app.set("view engine", "hbs");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("68270fef4d4bc0a8670e4cef")
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }

      req.user = user;

      next();
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
    });
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(productsController.get404);

mongoConnect(() => {
  app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
});
