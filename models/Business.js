const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    websiteStatus: { type: Boolean, default: false },
    visited: { type: Boolean, default: false },
    contactInfo: { type: String, required: true },
    businessCategory: { type: String, required: true },
    area: { type: String, required: true },
    notes: { type: String, default: "" },
    location: { type: String, required: true },
    pickingDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    completedstatus: { 
      type: String, 
      enum: ["Pending", "Progress", "Completed"],
      required: [true, "Completed status is required"],
      default: "Pending" // Add default value
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
