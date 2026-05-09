const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CompletedNormal = require("../models/CompletedNormal");
const CompletedShared = require("../models/CompletedShared");
const ShipmentLoad = require("../models/ShipmentLoad");
const ShipmentNormal = require("../models/ShipmentNormal");
const ShipmentShared = require("../models/ShipmentShared");
const mongoose = require("mongoose");

router.post("/payment", async (req, res) => {
  const status = req.body.isShared;
  const shipmentId = req.body.shipmentId;

  const priceObj = await ShipmentLoad.findById(
    new mongoose.Types.ObjectId(shipmentId),
    { price: 1, _id: 0 }
  );
  const price = priceObj.price;
  await stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount * 100,
      currency: "pkr",
    },
    async (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
        console.log(stripeErr);
      } else {
        let result1;
        // let error;

        if (status) {
          console.log("Here");
          try {
            result1 = await ShipmentShared.findOneAndDelete({
              customer_shipment_id: shipmentId,
            });

            console.log("Result=>", result1);

            const {
              customer_shipment_id,
              customer_id,
              driver_id,
              status,
              driver_location,
            } = result1;
            const newObj = {
              customer_shipment_id,
              customer_id,
              driver_id,
              status: "Completed",
              driver_location,
              price: price,
            };

            console.log("newObj=>", newObj);

            const newShipment = new CompletedShared(newObj);

            const savedShipment = await newShipment.save();
          } catch (error) {
            console.log(error);
            res.status(500).json({
              message: "Error processing the fee",
              error: error.message,
            });
            return;
          }
        } else if (!status) {
          // console.log("Here");
          try {
            result1 = await ShipmentNormal.findOneAndDelete({
              shipment_id: shipmentId,
            });
            const { shipment_id, driver_id, status, driver_location } = result1;

            const newObj = {
              shipment_id,
              driver_id,
              status: "Completed",
              driver_location,
              price: price,
            };
            // console.log("newObj=>", newObj);

            const newShipment = new CompletedNormal(newObj);

            const savedShipment = await newShipment.save();
          } catch (error) {
            console.log(error);
            res.status(500).json({
              message: "Error processing the fee",
              error: error.message,
            });
            return;
          }
        }
        res.status(200).json(stripeRes);
      }
    }
  );

  console.log("Process Completed");
});

module.exports = router;
