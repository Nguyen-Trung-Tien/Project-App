const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRoutes");
const CategoryRouter = require("./CategoryRouter");
const ReviewRouter = require("./ReviewRouter");
const CartRouter = require("./CartRouter");
const CartItemRouter = require("./CartItemRouter");

const routes = (app) => {
  app.use("/api/v1/user", UserRouter);
  app.use("/api/v1/product", ProductRouter);
  app.use("/api/v1/category", CategoryRouter);
  app.use("/api/v1/review", ReviewRouter);
  app.use("/api/v1/cart", CartRouter);
  app.use("/api/v1/cartItem", CartItemRouter);
};
module.exports = routes;
