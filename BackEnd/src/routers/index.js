const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRoutes");

const routes = (app) => {
  app.use("/api/v1/user", UserRouter);
  app.use("/api/v1/product", ProductRouter);
};

module.exports = routes;
