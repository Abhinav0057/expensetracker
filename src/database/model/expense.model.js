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
  participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
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

const splitExpenseSchema = new Schema({
  expense: { type: mongoose.Types.ObjectId, ref: "Expense", required: true },
  payer: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  participants: [
    { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ],
  amount: { type: Number, required: true },
  split_amount: { type: Number, required: true },
  settled: { type: Boolean, default: false },
  settled_by: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

//   make schemem to models

const ExpenseCategory = mongoose.model(
  "ExpenseCategory",
  expenseCategorySchema
);
const Expense = mongoose.model("Expense", expenseSchema);

const SplitExpense = mongoose.model("SplitExpense", splitExpenseSchema);

// Export the models
module.exports = {
  ExpenseCategory,
  Expense,
  SplitExpense,
};
