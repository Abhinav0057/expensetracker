const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Income Category Schema
const incomeCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// Define the Income Schema
const incomeSchema = new Schema({
  description: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "IncomeCategory", // Reference the IncomeCategory model
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Create models from the schemas
const IncomeCategory = mongoose.model("IncomeCategory", incomeCategorySchema);
const Income = mongoose.model("Income", incomeSchema);

// Export the models
module.exports = {
  IncomeCategory,
  Income,
};
