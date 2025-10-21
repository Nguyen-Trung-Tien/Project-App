const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routers");
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Cookie
app.use(cookieParser());

// Static
app.use(express.static("public"));

// Mount routes
routes(app);

// Connect DB
connectDB();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Connect server success, ${port}`);
});
