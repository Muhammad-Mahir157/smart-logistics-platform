const mongoose = require("mongoose");

const CompletedSharedSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    customer_shipment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ShipmentLoad",
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
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CompletedShipmentShared",
  CompletedSharedSchema
);
