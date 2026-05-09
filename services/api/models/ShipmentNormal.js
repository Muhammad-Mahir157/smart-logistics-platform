const mongoose = require("mongoose");

const ShipmentNormalSchema = new mongoose.Schema(
  {
    shipment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "ShipmentLoad"
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: { type: String, required: true },
    driver_location: { type: [Number], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShipmentNormal", ShipmentNormalSchema);
