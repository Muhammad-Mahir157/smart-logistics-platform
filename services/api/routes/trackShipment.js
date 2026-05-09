const router = require("express").Router();
const ShipmentNormal = require("../models/ShipmentNormal");
const ShipmentLoad = require("../models/ShipmentLoad");
const mongoose = require("mongoose");
const ShipmentShared = require("../models/ShipmentShared");
// const jwt = require("jsonwebtoken");
const { verifyToken } = require("./verifyToken");

// router.get("/normal/", async (req, res) => {
//   try {
//     const shipments = await ShipmentLoad.aggregate([
//       {
//         $match: {
//           customer_id: new mongoose.Types.ObjectId(req.headers.customer_id),
//         },
//       },
//       {
//         $lookup: {
//           from: "ShipmentNormal",
//           localField: "_id",
//           foreignField: "shipment_id",
//           as: "shipmentNormal",
//         },
//       },
//     ]);
//     console.log(shipments);
//     res.json(shipments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

//
//
// Get Data For Shared Shipment
//
//

// router.get("/shared", verifyToken, async (req, res) => {
//   // const customer_id = req.headers.authorization.split(" ")[1];

//   if (!req.user.id) {
//     res.status.json("Error: Token invalid!");
//     return;
//   }

//   const customer_id = req.user.id;

//   const result = await ShipmentShared.find({
//     customer_id: new mongoose.Types.ObjectId(customer_id),
//   });

//   // console.log(result);

//   // [{{customer_shiment_details}, [other_shipments_shared], driver_id, status}]

//   // let shipmentIds = [];
//   // result.map((data, index) =>)
//   // const sharedShipmentTrackingData = [];
//   const promise = result.map(async (inProgessShipment, index) => {
//     const shipmentDetails = await ShipmentLoad.find({
//       _id: inProgessShipment.customer_shipment_id,
//     });

//     // console.log("This is details\n", shipmentDetails);

//     const promiseData = inProgessShipment.shipment_ids.map(
//       async (sharedShipmentId) => {
//         const sharedShipmentDestination = await ShipmentLoad.find(
//           {
//             _id: sharedShipmentId,
//           },
//           { destinationAddress: 1 }
//         );
//         // console.log(
//         //   "This is shared Shipment Destination\n",
//         //   sharedShipmentDestination
//         // );

//         return sharedShipmentDestination[0].destinationAddress;
//       }
//     );

//     const sharedShipmentDestinations = await Promise.all(promiseData);

//     console.log(
//       "This is shared Shipment Destinations\n",
//       sharedShipmentDestinations
//     );

//     // create Object
//     // const data = JSON.parse(
//     //   JSON.stringify({
//     //     shipment_details: shipmentDetails[0],
//     //     other_shipments: sharedShipmentDestinations,
//     //     driver_id: inProgessShipment.driver_id,
//     //     status: inProgessShipment.status,
//     //   })
//     // );
//     const data = Object.assign({
//       shipment_details: shipmentDetails[0],
//       other_shipments: sharedShipmentDestinations,
//       driver_id: inProgessShipment.driver_id,
//       status: inProgessShipment.status,
//     });
//     // sharedShipmentTrackingData.push(data);
//     // console.log("This is data", data);

//     return data;
//   });

//   const sharedShipmentTrackingData = await Promise.all(promise);

//   // console.log(
//   //   "This the object that will be shared",
//   //   sharedShipmentTrackingData
//   // );
//   res.send(sharedShipmentTrackingData);
// });

router.get("/shared", verifyToken, async (req, res) => {
  if (!req.user.id) {
    res.status.json("Error: Token invalid!");
    return;
  }

  const customer_id = req.user.id;

  const result = await ShipmentShared.find(
    {
      customer_id: new mongoose.Types.ObjectId(customer_id),
    },
    { customer_id: 1, _id: 0, driver_id: 1, customer_shipment_id: 1, status: 1 }
  );

  const promise = result.map(async (inProgessShipment, index) => {
    const shipmentDetails = await ShipmentLoad.find({
      _id: inProgessShipment.customer_shipment_id,
    });

    // find all the shipments where inProgessShipment.driver_id is equal to
    // driver_id of other sharedShipment enteries

    const otherShipmentsObject = await ShipmentShared.find(
      {
        driver_id: inProgessShipment.driver_id,
        customer_shipment_id: { $ne: inProgessShipment.customer_shipment_id },
      },
      { customer_shipment_id: 1, _id: 0 }
    );

    // otherShipmentsObject will be an array of object to convert it into array

    const otherShipmentsArr = otherShipmentsObject.map((data) => {
      return data.customer_shipment_id;
    });

    console.log("otherShipmentsArr =", otherShipmentsArr);

    // now for each shipment id in otherShipmentsArr. We get destination address of
    // that shipment

    const promiseData = otherShipmentsArr.map(async (sharedShipmentId) => {
      const sharedShipmentDestination = await ShipmentLoad.find(
        {
          _id: sharedShipmentId,
        },
        { destinationAddress: 1 }
      );

      return sharedShipmentDestination[0].destinationAddress;
    });

    const sharedShipmentDestinations = await Promise.all(promiseData);

    console.log(
      "This is shared Shipment Destinations\n",
      sharedShipmentDestinations
    );
    const data = Object.assign({
      shipment_details: shipmentDetails[0],
      other_shipments: sharedShipmentDestinations,
      driver_id: inProgessShipment.driver_id,
      status: inProgessShipment.status,
    });

    return data;
  });

  const sharedShipmentTrackingData = await Promise.all(promise);

  console.log("sharedShipmentTrackingData =", sharedShipmentTrackingData);

  res.send(sharedShipmentTrackingData);
});

//
//
// Get Driver Location For Shared Shipment
//
//

router.post("/shared/driverlocation", verifyToken, async (req, res) => {
  // const customer_id = req.headers.authorization.split(" ")[1];
  const customer_id = req.user.id;
  const temp = req.body.data;
  const shipmentIds = [];
  temp.forEach((data, index) => {
    shipmentIds.push(new mongoose.Types.ObjectId(data));
  });

  // console.log("These are shipment ids for driver location \n", shipmentIds);

  // const result = await ShipmentNormal.find(
  //   {
  //     customer_shipment_id: { $in: shipmentIds },
  //   },
  //   { customer_shipment_id: 1, driver_id: 1, driver_location: 1 }
  // );
  // console.log("This is the result for driver location", result);
  // res.send(result);

  const getShipmentLocations = (shipmentIds) => {
    return new Promise((resolve, reject) => {
      ShipmentShared.find(
        {
          customer_shipment_id: { $in: shipmentIds },
        },
        { customer_shipment_id: 1, driver_id: 1, driver_location: 1 }
      )
        .then((result) => {
          // console.log("This is the result for driver location", result);
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getShipmentLocations(shipmentIds)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      // handle error
    });
});

// Status for shared shipment

router.post("/shared/updatestatus", verifyToken, async (req, res) => {
  console.log(req.body.shipment_id);

  const shipmentIds = req.body.shipment_id;
  const resObject = {};

  async function processShipmentIds() {
    for (const id of shipmentIds) {
      const driverId = await ShipmentShared.findOne(
        { customer_shipment_id: id },
        { driver_id: 1, _id: 0 }
      );

      console.log("driverId", driverId);

      const shipments = await ShipmentShared.find(
        { driver_id: driverId.driver_id },
        { status: 1, _id: 0, customer_shipment_id: 1 }
      );

      console.log("shipments", shipments);

      const sharedStatusObj = {};
      shipments.forEach((data) => {
        sharedStatusObj[data.customer_shipment_id] = data.status;
      });

      console.log("sharedStatusObj", sharedStatusObj);

      resObject[id] = sharedStatusObj;
    }

    console.log("This is resObject", resObject);
    res.status(200).json(resObject);
  }

  processShipmentIds().catch((error) => {
    console.log("Error occurred:", error);
  });

  // following code is not working due to async nature

  // shipmentIds.forEach(async (id) => {
  //   const driverId = await ShipmentShared.findOne(
  //     { customer_shipment_id: id },
  //     { driver_id: 1, _id: 0 }
  //   );

  //   console.log("driverId", driverId);

  //   // now for each driver id find the related shipments

  //   const shipments = await ShipmentShared.find(
  //     { driver_id: driverId.driver_id },
  //     { status: 1, _id: 0, customer_shipment_id: 1 }
  //   );

  //   console.log("shipments", shipments);

  //   // now make object from shipment of the format
  //   // {shipment_id: status}

  //   const sharedStatusObj = {};
  //   shipments.forEach((data) => {
  //     sharedStatusObj[data.customer_shipment_id] = data.status;
  //   });

  //   console.log("sharedStatusObj", sharedStatusObj);

  //   // format of resObject
  //   // {customer_shipment_id: {id_of_shipments_which_are_shared: their_status}}
  //   resObject[id] = sharedStatusObj;
  // });

  // console.log("This is resObject", resObject);
});

//
//
// Get Data For Normal Shipment
//
//

router.get("/normal", verifyToken, async (req, res) => {
  // const customer_id = req.headers.id;
  const customer_id = req.user.id;

  const result = await ShipmentLoad.find({
    customer_id: new mongoose.Types.ObjectId(customer_id),
  });

  let shipmentIds = [];

  result.forEach((object, index) => {
    shipmentIds.push(object._id);
  });

  console.log(result);
  //   res.send(result);

  const result2 = await ShipmentNormal.find({
    shipment_id: { $in: shipmentIds },
  });

  console.log(result2);

  const combinedArray = result2.map((obj1) => {
    const obj2 = result.find((obj) => obj._id.equals(obj1.shipment_id));
    if (obj2) {
      return { ...obj1.toObject(), ...obj2.toObject(), status: obj1.status };
    }
    return obj1.toObject();
  });

  const attributesToDelete = ["createdAt", "updatedAt", "__v", "_id"];

  const newArray = combinedArray.map((obj) => {
    const newObj = {};
    for (const key in obj) {
      if (!attributesToDelete.includes(key)) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  });

  console.log(newArray);

  res.send(newArray);
});

//
//
// Get Driver Location For Normal Shipment
//
//

router.post("/normal/driverlocation", async (req, res) => {
  // const customer_id = req.headers.id;
  // const customer_id = req.user.id;
  console.log("driver location");
  const temp = req.body.data;
  const driverIds = [];
  temp.forEach((data, index) => {
    driverIds.push(new mongoose.Types.ObjectId(data));
  });

  // console.log(driverIds);

  const result = await ShipmentNormal.find(
    {
      driver_id: { $in: driverIds },
    },
    { shipment_id: 1, driver_id: 1, driver_location: 1 }
  );
  // console.log(result);
  res.send(result);
});

// get status

router.post("/normal/updatestatus", verifyToken, async (req, res) => {
  console.log(req.body.shipment_id);

  try {
    const result = await ShipmentNormal.find(
      { shipment_id: { $in: req.body.shipment_id } },
      { status: 1, _id: 0, shipment_id: 1 }
    ).sort({ createdAt: 1 });

    // const statusArr = result.map((data) => {
    //   return { [data.shipment_id]: data.status };
    // });

    let statusObj = {};

    result.forEach((obj) => {
      statusObj[obj.shipment_id] = obj.status;
    });

    res.status(200).json(statusObj);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// router.get("/normal/temp", async (req, res) => {
//   try {
//     const shipment = await ShipmentNormal.findOne({
//       shipment_id: new mongoose.Types.ObjectId("641949fa8a88881be9b2fb6d"),
//     })
//       .populate("shipment_id")
//       .exec();

//     console.log(shipment);
//     res.status(200).send(shipment);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send(err);
//   }
// });

// router.get("/normal/temp", async (req, res) => {
//   try {
//     const shipments = await ShipmentLoad.aggregate([
//       {
//         $lookup: {
//           from: "ShipmentNormal",
//           localField: "_id",
//           foreignField: "shipment_id",
//           as: "shipmentNormal",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           shipmentNormal: 1,
//         },
//       },
//     ]);
//     // console.log(shipments);
//     res.json(shipments);
//   } catch (error) {
//     // console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

// router.get("/normal/temp", async (req, res) => {
//   try {
//     const shipments = await ShipmentNormal.aggregate([
//       {
//         $lookup: {
//           from: "ShipmentLoad",
//           localField: "shipment_id",
//           foreignField: "_id",
//           as: "shipmentLoad",
//         },
//       },
//       //   {
//       //     $project: {
//       //       _id: 1,
//       //       shipmentNormal: 1,
//       //     },
//       //   },
//     ]);
//     // console.log(shipments);
//     res.json(shipments);
//   } catch (error) {
//     // console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
