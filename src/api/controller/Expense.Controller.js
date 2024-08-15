const User = require("../../database/model/user.model");
const {
  ExpenseCategory,
  Expense,
  splitExpenseSchema,
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
const createSplitExpense = async (req, res, next) => {
  try {
    let { expense, payer, participants, amount, split_amount, settled_by } = req.body;

    // Validate if the expense exists
    const existingExpense = await Expense.findById(expense);
    if (!existingExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Validate if the payer exists
    const payerUser = await User.findById(payer);
    if (!payerUser) {
      return res.status(404).json({ message: 'Payer not found' });
    }

    // Validate if all participants exist
    const participantUsers = await User.find({ _id: { $in: participants } });
    if (participantUsers.length !== participants.length) {
      return res.status(400).json({ message: 'One or more participants are invalid' });
    }

    // Validate the split amount
    if (split_amount * participants.length !== amount) {
      return res.status(400).json({ message: 'The split amount does not match the total amount' });
    }

    // Create the split expense
    const splitExpense = new SplitExpense({
      expense,
      payer,
      participants,
      amount,
      split_amount,
      settled_by, // Optionally include this if it's provided
    });

    await splitExpense.save();
    return res.status(201).json(splitExpense);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getSplitExpenseById= async (req, res,next) => {
  try {
    const { id } = req.params;

    const splitExpense = await SplitExpense.findById(id)
      .populate('expense')
      .populate('payer')
      .populate('participants')
      .populate('settled_by');

    if (!splitExpense) {
      return res.status(404).json({ message: 'Split expense not found' });
    }

    res.status(200).json(splitExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateSplitExpense= async (req, res,next) => {
  try {
    const { id } = req.params;
    const { expense, payer, participants, amount, split_amount, settled, settled_by } = req.body;

    // Validate if the split expense exists
    const splitExpense = await SplitExpense.findById(id);
    if (!splitExpense) {
      return res.status(404).json({ message: 'Split expense not found' });
    }

    // Validate if the expense exists
    if (expense && !(await Expense.findById(expense))) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Validate if the payer exists
    if (payer && !(await User.findById(payer))) {
      return res.status(404).json({ message: 'Payer not found' });
    }

    // Validate if all participants exist
    if (participants) {
      const participantUsers = await User.find({ _id: { $in: participants } });
      if (participantUsers.length !== participants.length) {
        return res.status(400).json({ message: 'One or more participants are invalid' });
      }
    }

    // Validate the split amount
    if (split_amount && split_amount * participants.length !== amount) {
      return res.status(400).json({ message: 'The split amount does not match the total amount' });
    }

    // Validate if all settled_by users exist
    if (settled_by) {
      const settledByUsers = await User.find({ _id: { $in: settled_by } });
      if (settledByUsers.length !== settled_by.length) {
        return res.status(400).json({ message: 'One or more settled_by users are invalid' });
      }
    }

    // Update the split expense
    splitExpense.expense = expense || splitExpense.expense;
    splitExpense.payer = payer || splitExpense.payer;
    splitExpense.participants = participants || splitExpense.participants;
    splitExpense.amount = amount || splitExpense.amount;
    splitExpense.split_amount = split_amount || splitExpense.split_amount;
    splitExpense.settled = typeof settled !== 'undefined' ? settled : splitExpense.settled;
    splitExpense.settled_by = settled_by || splitExpense.settled_by;

    const updatedSplitExpense = await splitExpense.save();
    res.status(200).json(updatedSplitExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { getAllExpenseCategory, getMyExpenses, postMyExpenses };
