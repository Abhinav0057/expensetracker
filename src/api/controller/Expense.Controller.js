const User = require("../../database/model/user.model");
const {
  ExpenseCategory,
  Expense,
} = require("../../database/model/expense.model");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../../infrastrcuture/Middleware/Auth/Auth.Middlware");

const mongoose = require("mongoose");

const getAllExpenseCategory = async (req, res, next) => {
  let expenseCategory;
  try {
    expenseCategory = await ExpenseCategory.find();
  } catch (err) {
    console.log(err);
  }
  if (!expenseCategory) {
    return res.status(404).json({ message: "users not found" });
  }
  return res.status(200).json({ expenseCategory: expenseCategory });
};
const getMyExpenses = async (req, res, next) => {
  let expense;
  try {
    expense = await User.findById(req.user.id)
      .select("expenses")
      .populate("expenses");
  } catch (err) {
    console.log(err);
  }
  if (!expense) {
    return res.status(404).json({ message: "data not found" });
  }
  return res.status(200).json({ expense: expense });
};
const postMyExpenses = async (req, res, next) => {
  const { description, category, amount, userId } = req.body;

  // Validate user exists
  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching user failed, please try again." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the new expense
    const expense = new Expense({
      description,
      category,
      amount,
      user: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await expense.save({ session });

    // Update user's expenses
    user.expenses.push(expense);
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ expense });
  } catch (err) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    res
      .status(500)
      .json({ message: "Creating expense failed, please try again." });
  }
};

module.exports = { getAllExpenseCategory, getMyExpenses, postMyExpenses };
