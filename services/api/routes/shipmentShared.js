const router = require("express").Router();
const ShipmentShared = require("../models/ShipmentShared");
const ShipmentLoad = require("../models/ShipmentLoad");
const mongoose = require("mongoose");
const { verifyToken, verifyDriverAuthToken } = require("./verifyToken");
const CompletedShared = require("../models/CompletedShared");

router.post("/", async (req, res) => {
  const newShipment = new ShipmentShared(req.body.data);

  try {
    const savedShipment = await newShipment.save();
    res.status(201).json(savedShipment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getDriverSharedShipments", verifyDriverAuthToken, async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is accessible from req.user

  if(userId == null) {
    return res
    .status(401)
    .json({ error: "Unauthorized User!" });
  }

  ShipmentShared.find({ driver_id: userId }).populate("customer_shipment_id")
    .then((sharedShipments) => {
      console.log("These are shared shipments", sharedShipments);
      res.json(sharedShipments);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving shared shipments." });
    });
});

router.get("/getDriverCompletedSharedShipments", verifyDriverAuthToken, async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is accessible from req.user

  if(userId == null) {
    return res
    .status(401)
    .json({ error: "Unauthorized User!" });
  }

  CompletedShared.find({ driver_id: userId }).populate("customer_shipment_id")
    .then((sharedShipments) => {
      console.log("These are shared shipments", sharedShipments);
      res.json(sharedShipments);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving shared shipments." });
    });
});


router.post("/updateDriverLocation", verifyDriverAuthToken, async (req, res) => {
  const userId = req.user.id;
  const driverLocation = req.body.driver_location; // Assuming the driver_location is provided in the request body

  if (userId == null) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }

  try {
    await ShipmentShared.updateMany(
      { driver_id: userId },
      { $set: { driver_location: driverLocation } }
    );

    res.json({ message: "Driver location updated successfully for shared shipments." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating driver location for shared shipments." });
  }
});


router.post("/cancel/active/:id", verifyDriverAuthToken, async (req, res) => {
  console.log(req.params.id);

  let result1;
  // let error;

    try {
      result1 = await ShipmentShared.findOneAndDelete({ _id : req.params.id, status : "Active"});
    } catch (error) {
      res.status(500).json({
        message: "Error canceling active shipment",
        error: error.message,
      });
      return;
    }
  

  const update = { status: false };
  try {
    const result = await ShipmentLoad.findByIdAndUpdate(
      new mongoose.Types.ObjectId(result1.customer_shipment_id._id),
      update,
      {
        new: true,
      }
    );
    // console.log(result);

    if (result && result1) {
      res
        .status(200)
        .json({ message: "Shipment set to pending state", data: result });
    } else {
      res
        .status(404)
        .json({ message: "No Shipment found with the provided ID" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error canceling active shipment",
      error: error.message,
    });
  }
});


module.exports = router;
