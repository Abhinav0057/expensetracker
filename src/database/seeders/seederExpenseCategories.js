const mongoose = require("mongoose");
const { ExpenseCategory } = require("../model/expense.model"); // Adjust the path to your models file

// Define the categories you want to seed
const expenseCategories = [
  { name: "Rent" },
  { name: "Utilities" },
  { name: "Groceries" },
  { name: "Transportation" },
  { name: "Entertainment" },
  { name: "Share Market" },
  { name: "Food" },
  { name: "Others" },
];

async function seedExpenseCategories() {
  try {
    // Clear the ExpenseCategory collection before seeding
    await ExpenseCategory.deleteMany({});

    // Insert the predefined categories
    await ExpenseCategory.insertMany(expenseCategories);

    console.log("Expense categories have been seeded successfully!");

    // Disconnect from the database
  } catch (error) {
    console.error("Error seeding expense categories:", error);
    mongoose.disconnect();
  }
}

// Run the seeder

mongoose
  .connect(
    "mongodb+srv://mongolearn:mongolearn@cluster0.yldrtwz.mongodb.net/expense_tracker?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB connected");
    seedExpenseCategories();
  })
  .catch((err) => {
    console.log("Some Error Occurred While connecting to db", err);
  });
