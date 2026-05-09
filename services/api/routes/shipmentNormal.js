const router = require("express").Router();
const ShipmentNormal = require("../models/ShipmentNormal");
const CompletedNormal = require("../models/CompletedNormal");
const ShipmentLoad = require("../models/ShipmentLoad");
const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
const { verifyToken, verifyDriverAuthToken } = require("./verifyToken");

router.post("/", async (req, res) => {
  const newShipment = new ShipmentNormal(req.body);

  try {
    const savedShipment = await newShipment.save();
    res.status(201).json(savedShipment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getDriverNormalShipments", verifyDriverAuthToken, async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is accessible from req.user

  if(userId == null) {
    return res
    .status(401)
    .json({ error: "Unauthorized User!" });
  }

  ShipmentNormal.find({ driver_id: userId }).populate("shipment_id")
    .then((nomralShipments) => {
      console.log("These are normal shipments", nomralShipments);
      res.json(nomralShipments);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving normal shipments." });
    });
});


router.get("/getDriverCompletedNormalShipments", verifyDriverAuthToken, async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is accessible from req.user

  if(userId == null) {
    return res
    .status(401)
    .json({ error: "Unauthorized User!" });
  }

  CompletedNormal.find({ driver_id: userId }).populate("shipment_id")
    .then((nomralShipments) => {
      console.log("These are normal shipments", nomralShipments);
      res.json(nomralShipments);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving normal shipments." });
    });
});

router.post("/updateDriverLocation", verifyDriverAuthToken, async (req, res) => {
  const userId = req.user.id;
  const driverLocation = req.body.driver_location; // Assuming the driver_location is provided in the request body

  if (userId == null) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }

  try {
    await ShipmentNormal.updateMany(
      { driver_id: userId },
      { $set: { driver_location: driverLocation } }
    );

    res.json({ message: "Driver location updated successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating driver location." });
  }
});


router.post("/cancel/active/:id", verifyDriverAuthToken, async (req, res) => {

  console.log(req.params.id);
  let result1;
  // let error;

    try {
      result1 = await ShipmentNormal.findOneAndDelete({ _id : req.params.id, status : "Active"});
    } catch (error) {
      res.status(500).json({
        message: "Error canceling active shipment",
        error: error.message,
      });
      return;
    }

  const update = { status: false };
  try {
    console.log(result1);
    const result = await ShipmentLoad.findByIdAndUpdate(
      new mongoose.Types.ObjectId(result1.shipment_id._id),
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

