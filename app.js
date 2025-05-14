const express = require("express");
const path = require("path");
const expresHbs = require("express-handlebars");
const productsController = require("./controllers/error");
const mongoConnect = require("./util/database");

// const User = require("./models/user");

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

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
  // User.findByPk(1)
  //   .then((user) => {
  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.error("Error fetching user:", err);
  //     next(err); // Pass the error to the error-handling middleware
  //   });
});

// app.use("/admin", adminRoutes);

// app.use(shopRoutes);

app.use(productsController.get404);

mongoConnect((client) => {
  console.log("client", client);
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
