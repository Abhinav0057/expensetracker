const express = require("express");
const expenseRouter = express.Router();
const {
  authenticateUser,
} = require("../../infrastrcuture/Middleware/Auth/Auth.Middlware");

const {
  getAllExpenseCategory,
  getMyExpenses,
  postMyExpenses,
} = require("../controller/Expense.Controller");

expenseRouter.get("/expense-category", getAllExpenseCategory);
expenseRouter.get("/expense", authenticateUser, getMyExpenses);
expenseRouter.post("/expense", authenticateUser, postMyExpenses);

module.exports = expenseRouter;
