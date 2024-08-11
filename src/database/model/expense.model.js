const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const expenseSchema = new Schema({
  description: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "ExpenseCategory",
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    default: false,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ExpenseCategory = mongoose.model(
  "ExpenseCategory",
  expenseCategorySchema
);
const Expense = mongoose.model("Expense", expenseSchema);

// Export the models
module.exports = {
  ExpenseCategory,
  Expense,
};
