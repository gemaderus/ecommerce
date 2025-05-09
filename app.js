const express = require("express");
const path = require("path");
const expresHbs = require("express-handlebars");
const productsController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
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
  User.findByPk(1)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      next(err); // Pass the error to the error-handling middleware
    });
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(productsController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync() // { force: true } will drop the table if it exists
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    console.log("User created or fetched:", user);
    app.listen(8080);
  })
  .catch((err) => {
    console.error("Error during database initialization:", err);
  });
