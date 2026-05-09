const router = require("express").Router();
const ShipmentLoad = require("../models/ShipmentLoad");
const mongoose = require("mongoose");
const ShipmentNormal = require("../models/ShipmentNormal");
const ShipmentShared = require("../models/ShipmentShared");
const { route } = require("./requestShipment");
const { verify } = require("jsonwebtoken");
const { verifyToken } = require("./verifyToken");

router.get("/normal/:id", async (req, res) => {
  const driverId = req.params.id;
  //   const driverId = req.user.id;

  try {
    const shipmentId = await ShipmentNormal.findOne(
      {
        driver_id: new mongoose.Types.ObjectId(driverId),
      },
      { shipment_id: 1, _id: 0, status: 1 }
    );

    if (!shipmentId) {
      res.status(204).json("No shipment found");
      return;
    }

    const result = await ShipmentLoad.findById(shipmentId.shipment_id);

    if (!result) {
      res.status(204).json("No shipment found");
      return;
    }

    console.log("result =>", { ...result._doc, status: shipmentId.status });
    res.status(200).json({ ...result._doc, status: shipmentId.status });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error in getting data from backend");
  }
});

router.get("/shared/:id", async (req, res) => {
  const driverId = req.params.id;
  //   const driverId = req.user.id;

  // find the shipment ids in ShipmentShared table using driver id

  try {
    const shipmentIds = await ShipmentShared.find(
      {
        driver_id: new mongoose.Types.ObjectId(driverId),
      },
      { customer_shipment_id: 1, status: 1, _id: 0 }
    );

    if (!shipmentIds) {
      res.status(204).json("No shipment found");
      return;
    }

    // convert shipmentIds to array

    const idsArr = shipmentIds.map((data) => {
      return data.customer_shipment_id;
    });

    const result = await ShipmentLoad.find({ _id: { $in: idsArr } });

    if (!result) {
      res.status(204).json("No shipment found");
      return;
    }

    // const updatedResult = [];

    console.log("shipmentIds =>", shipmentIds);
    console.log("result =>", result);

    // const temp = result.filter((data) =>
    //   data._id.equals(new mongoose.Types.ObjectId("6474d9523f8999692fb18ab3"))
    // );
    // console.log("temp =>", temp);
    // console.log("temp[0]._id =>", temp[0]._id);

    // shipmentIds.forEach((obj) => {
    //   updatedResult.push({
    //     ...result.filter((data) => {
    //       data._id.equals(obj.customer_shipment_id);
    //     }),
    //     status: obj.status,
    //   });
    // });

    const updatedResult = result.map((obj) => {
      const shipment = shipmentIds.find((shipment) =>
        shipment.customer_shipment_id.equals(obj._id)
      );

      if (shipment) {
        return {
          ...obj._doc,
          status: shipment.status,
          //   _id: obj._id.toString(),
        };
      }
      return obj;
    });

    console.log("updated result =>", updatedResult);
    res.status(200).json(updatedResult);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error in getting data from backend");
  }
});

router.get("/shared/status/:id", async (req, res) => {
  const driverId = req.params.id;
  //   const driverId = req.user.id;

  // find the shipment ids in ShipmentShared table using driver id

  try {
    const shipmentIds = await ShipmentShared.find(
      {
        driver_id: new mongoose.Types.ObjectId(driverId),
      },
      { customer_shipment_id: 1, status: 1, _id: 0 }
    );

    if (!shipmentIds) {
      res.status(204).json("No shipment found");
      return;
    }

    const statusObj = {};

    shipmentIds.forEach((data) => {
      statusObj[data.customer_shipment_id] = data.status;
    });

    console.log("status obj =>", statusObj);
    res.status(200).json(statusObj);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error in getting data from backend");
  }
});

router.post("/shared/inprogress_to_paymentpending/:id", async (req, res) => {
  const driverId = req.params.id;
  //   const driverId = req.user.id;
  const shipmentId = req.body.shipmentId;

  // find the shipment ids in ShipmentShared table using driver id

  try {
    const result = await ShipmentShared.findOneAndUpdate(
      {
        customer_shipment_id: new mongoose.Types.ObjectId(shipmentId),
      },
      { status: "Payment Pending" },
      { new: true }
    );

    if (!result) {
      res.status(204).json("No shipment found");
      return;
    }

    console.log("result =>", result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error in getting data from backend");
  }
});

router.post("/normal/inprogress_to_paymentpending/:id", async (req, res) => {
  const driverId = req.params.id;
  try {
    const result = await ShipmentNormal.findOneAndUpdate(
      {
        driver_id: new mongoose.Types.ObjectId(driverId),
      },
      { status: "Payment Pending" },
      { new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error in changing the status");
  }
});

router.post("/normal/status/:id", async (req, res) => {
  const driverId = req.params.id;

  //   console.log("this is drive id", driverId);

  try {
    const result = await ShipmentNormal.findOne(
      {
        driver_id: new mongoose.Types.ObjectId(driverId),
      },
      { status: 1, _id: 0 }
    );
    // console.log("This is result", result);
    if(result)
    res.status(200).json(result.status);
    else 
    res.status(404).json(null);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error in changing the status");
  }
});

module.exports = router;
