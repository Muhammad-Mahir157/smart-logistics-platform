const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  vehicleCC: {
    type: Number,
    required: true,
  },
  vehicleRegistration: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Driver', DriverSchema);
