const mongoose = require("mongoose");

const ShipmentLoadSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
    },
    name: { type: String, required: true },
    pickupAddress: { type: [Number], required: true },
    destinationAddress: { type: [Number], required: true },
    Load: [
      {
        quantity: { type: Number, required: true },
        height: { type: Number, required: true },
        width: { type: Number, required: true },
        length: { type: Number, required: true },
        category: { type: String, required: true },
      },
    ],
    vehicleCategory: { type: String, required: true },
    vehiclePart: { type: Number, required: true },
    totalVolume: { type: Number, require: true },
    shared: { type: Boolean, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

// ShipmentLoadSchema.index({ customer_id: 1 }, { unique: false });

module.exports = mongoose.model("ShipmentLoad", ShipmentLoadSchema);
