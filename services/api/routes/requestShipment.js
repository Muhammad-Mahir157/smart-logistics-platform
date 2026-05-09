const router = require("express").Router();
const ShipmentLoad = require("../models/ShipmentLoad");
const mongoose = require("mongoose");
const ShipmentNormal = require("../models/ShipmentNormal");
const ShipmentShared = require("../models/ShipmentShared");
const DriverUser = require("../models/DriverUser");
// const jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyAuthToken,
  verifyDriverAdminAuthToken,
  verifyDriverAuthToken,
} = require("./verifyToken");

router.post("/", verifyToken, async (req, res) => {
  // const newObject = {
  //   ...req.body.data,
  //   customer_id: new mongoose.Types.ObjectId(req.headers.token),
  //   vehiclePart: 0,
  // };
  console.log("This is req.body", req.body);
  const newShipment = new ShipmentLoad({
    ...req.body,
    customer_id: new mongoose.Types.ObjectId(req.user.id),
    vehiclePart: 0,
  });
  console.log(newShipment);
  try {
    const savedShipment = await newShipment.save();
    res.status(201).json(savedShipment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get(
  "/getAllPendingShipmentRequests",
  verifyDriverAdminAuthToken,
  async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is accessible from req.user

    ShipmentLoad.find({ status: false })
      .then((loads) => {
        console.log("These are pending shipments", loads);
        res.json(loads);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while retrieving shipments loads.",
        });
      });
  }
);

router.get(
  "/getAllSharedShipmentRequests",
  verifyDriverAdminAuthToken,
  async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is accessible from req.user

    ShipmentLoad.find({ status: false, shared: true })
      .then((loads) => {
        console.log("These are pending shared shipments", loads);
        res.json(loads);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while retrieving shipments loads.",
        });
      });
  }
);

router.get(
  "/getAllNormalShipmentRequests",
  verifyDriverAdminAuthToken,
  async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is accessible from req.user

    ShipmentLoad.find({ status: false, shared: false })
      .then((loads) => {
        console.log("These are pending normal shipments", loads);
        res.json(loads);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while retrieving shipments loads.",
        });
      });
  }
);

router.post(
  "/acceptShipmentRequest",
  verifyDriverAuthToken,
  async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is accessible from req.user
    if (
      req.user.id == null ||
      req.body.shipment_id == null ||
      req.body.driver_location == null
    ) {
      return res.status(401).json({ error: "Invalid Request!" });
    }

    ShipmentLoad.findOne({ _id: req.body.shipment_id, status: false })
      .then(async (shipment_request) => {
        if (shipment_request == null) {
          return res
            .status(500)
            .json({ error: "An error occurred while retrieving shipment." });
        }
        const session = await mongoose.startSession();
        try {
          session.startTransaction();
          const driver = await DriverUser.findById(userId, null, { session });

          if (!shipment_request.shared) {
            await ShipmentNormal.create(
              [
                {
                  shipment_id: shipment_request,
                  driver_id: driver,
                  status: "Active",
                  driver_location: req.body.driver_location,
                },
              ],
              { session }
            );
          } else {
            await ShipmentShared.create(
              [
                {
                  customer_shipment_id: shipment_request,
                  customer_id: shipment_request.customer_id,
                  driver_id: driver,
                  status: "Active",
                  driver_location: req.body.driver_location,
                },
              ],
              { session }
            );
          }

          shipment_request.status = true;
          await shipment_request.save({ session });

          await session.commitTransaction();

          console.log("success");
          res.json(shipment_request);
        } catch (error) {
          console.log(error);
          res.status(500).json({
            error: "An error occurred while accepting the shipment request.",
          });
          await session.abortTransaction();
        }
        session.endSession();
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while retrieving shipment." });
      });
  }
);

router.get("/get/pending", verifyToken, async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is accessible from req.user

  ShipmentLoad.find({ customer_id: userId, status: false })
    .then((loads) => {
      console.log("These are pending shipments", loads);
      res.json(loads);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving shipments loads." });
    });
});

router.get("/get/active", verifyToken, async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is accessible from req.user

  const shipments = await ShipmentLoad.find({
    customer_id: userId,
    status: true,
  });

  const shipmentIds = shipments.map((data) => data._id);

  const normalShipment = await ShipmentNormal.find(
    {
      shipment_id: { $in: shipmentIds },
      status: "Active",
    },
    { shipment_id: 1, _id: 0 }
  );

  const sharedShipment = await ShipmentShared.find(
    {
      customer_shipment_id: { $in: shipmentIds },
      status: "Active",
    },
    { customer_shipment_id: 1, _id: 0 }
  );

  const normalIds = normalShipment.map((data) => data.shipment_id);

  const sharedIds = sharedShipment.map((data) => data.customer_shipment_id);

  const combineIds = [...normalIds, ...sharedIds];

  console.log(combineIds);

  ShipmentLoad.find({ _id: { $in: combineIds } })
    .then((loads) => {
      console.log("Active shipments:", loads);
      res.status(200).json(loads);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving shipment loads." });
    });
});

router.get("/get/payment_pending", verifyToken, async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is accessible from req.user

  const shipments = await ShipmentLoad.find({
    customer_id: userId,
    status: true,
  });

  const shipmentIds = shipments.map((data) => data._id);

  const normalShipment = await ShipmentNormal.find(
    {
      shipment_id: { $in: shipmentIds },
      status: "Payment Pending",
    },
    { shipment_id: 1, _id: 0 }
  );

  const sharedShipment = await ShipmentShared.find(
    {
      customer_shipment_id: { $in: shipmentIds },
      status: "Payment Pending",
    },
    { customer_shipment_id: 1, _id: 0 }
  );

  const normalIds = normalShipment.map((data) => data.shipment_id);

  const sharedIds = sharedShipment.map((data) => data.customer_shipment_id);

  const combineIds = [...normalIds, ...sharedIds];

  // console.log(combineIds);

  ShipmentLoad.find({ _id: { $in: combineIds } })
    .then((loads) => {
      // console.log("Payment Pending shipments:", loads);
      res.status(200).json(loads);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving shipment loads." });
    });
});

router.delete("/cancel/pending/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const result = await ShipmentLoad.findByIdAndDelete(
      new mongoose.Types.ObjectId(req.params.id)
    );
    // console.log(result);

    if (result) {
      res
        .status(200)
        .json({ message: "ShipmentLoad deleted successfully", data: result });
    } else {
      res
        .status(404)
        .json({ message: "No ShipmentLoad found with the provided ID" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error deleting ShipmentLoad", error: error.message });
  }
});

router.post("/cancel/active/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.isShared);

  let result1;
  // let error;

  if (req.body.isShared) {
    try {
      result1 = await ShipmentShared.findOneAndDelete({
        customer_shipment_id: req.params.id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error canceling active shipment",
        error: error.message,
      });
      return;
    }
  } else if (!req.body.isShared) {
    try {
      result1 = await ShipmentNormal.findOneAndDelete({
        shipment_id: req.params.id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error canceling active shipment",
        error: error.message,
      });
      return;
    }
  }

  const update = { status: false };
  try {
    const result = await ShipmentLoad.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.params.id),
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

router.post("/active_to_inprogress/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.isShared);

  let result;
  // let error;

  if (req.body.isShared) {
    try {
      result = await ShipmentShared.findOneAndUpdate(
        { customer_shipment_id: new mongoose.Types.ObjectId(req.params.id) },
        { status: "In Progress" },
        {
          new: true,
        }
      );

      console.log("This is result", result);

      res
        .status(200)
        .json({ message: "Shipment set to In Progress state", data: result });
    } catch (error) {
      res.status(500).json({
        message: "Error updating shipment state",
        error: error.message,
      });
      return;
    }
  } else if (!req.body.isShared) {
    try {
      result = await ShipmentNormal.findOneAndUpdate(
        { shipment_id: new mongoose.Types.ObjectId(req.params.id) },
        { status: "In Progress" },
        {
          new: true,
        }
      );

      res
        .status(200)
        .json({ message: "Shipment set to In Progress state", data: result });
    } catch (error) {
      res.status(500).json({
        message: "Error updating shipment state",
        error: error.message,
      });
      return;
    }
  }

  // const update = { status: false };
  // try {
  //   const result = await ShipmentLoad.findByIdAndUpdate(
  //     new mongoose.Types.ObjectId(req.params.id),
  //     update,
  //     {
  //       new: true,
  //     }
  //   );
  //   // console.log(result);

  //   if (result && result1) {
  //     res
  //       .status(200)
  //       .json({ message: "Shipment set to pending state", data: result });
  //   } else {
  //     res
  //       .status(404)
  //       .json({ message: "No Shipment found with the provided ID" });
  //   }
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({
  //     message: "Error canceling active shipment",
  //     error: error.message,
  //   });
  // }
});

module.exports = router;
