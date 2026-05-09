const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const requestShipmentRoute = require("./routes/requestShipment");
const shipmentNormal = require("./routes/shipmentNormal");
const trackShipment = require("./routes/trackShipment");
// const productRoute = require("./routes/product");
// const cartRoute = require("./routes/cart");
// const orderRoute = require("./routes/order");
// const stripeRoute = require("./routes/stripe");
const navigationRoute = require("./routes/shipmentNavigation");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const shipmentShared = require("./routes/shipmentShared");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/requestshipment", requestShipmentRoute);
app.use("/api/shipmentnormal", shipmentNormal);
app.use("/api/shipmentshared", shipmentShared);
app.use("/api/trackshipment", trackShipment);
app.use("/api/navigation", navigationRoute);
app.use("/api/checkout", stripeRoute);
// app.use("/api/users", userRoute);
// app.use("/api/products", productRoute);
// app.use("/api/carts", cartRoute);
// app.use("/api/orders", orderRoute);
// app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
