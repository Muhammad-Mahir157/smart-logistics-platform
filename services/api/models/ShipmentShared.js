const mongoose = require("mongoose");

const ShipmentSharedSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    customer_shipment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ShipmentLoad"
    },
    shipment_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: { type: String, required: true },
    driver_location: { type: [Number], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShipmentShared", ShipmentSharedSchema);
