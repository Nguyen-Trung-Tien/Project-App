const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRoutes");
const CategoryRouter = require("./CategoryRouter");
const ReviewRouter = require("./ReviewRouter");
const CartRouter = require("./CartRouter");
const CartItemRouter = require("./CartItemRouter");
const OrderRouter = require("./OrderRouter");
const OrderItemRouter = require("./OrderItemRouter");
const PaymentRouter = require("./PaymentRouter");
const AdminRouter = require("./AdminRoute");
const ChatRoutes = require("./chatRoutes");

const routes = (app) => {
  app.use("/api/v1/user", UserRouter);
  app.use("/api/v1/product", ProductRouter);
  app.use("/api/v1/category", CategoryRouter);
  app.use("/api/v1/review", ReviewRouter);
  app.use("/api/v1/cart", CartRouter);
  app.use("/api/v1/cartItem", CartItemRouter);
  app.use("/api/v1/order", OrderRouter);
  app.use("/api/v1/order-item", OrderItemRouter);
  app.use("/api/v1/payment", PaymentRouter);
  app.use("/api/v1/admin", AdminRouter);
  app.use("/api/v1/chat", ChatRoutes);
};
module.exports = routes;
