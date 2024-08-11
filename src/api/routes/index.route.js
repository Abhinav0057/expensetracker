const express = require("express");
const authRouter = require("./auth.routes");
const expenseRouter = require("./expense.route");
const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/expense", expenseRouter);

module.exports = indexRouter;
