const mongoose = require("mongoose");

const CompletedNormalSchema = new mongoose.Schema(
  {
    shipment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "ShipmentLoad",
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

module.exports = mongoose.model("CompletedNormal", CompletedNormalSchema);
