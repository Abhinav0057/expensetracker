const mongoose = require("mongoose");
const { IncomeCategory } = require("../model/income.model"); // Adjust the path to your models file

// Define the categories you want to seed
const incomeCategories = [
  { name: "Salary" },
  { name: "Freelance" },
  { name: "Investments" },
  { name: "Interest" },
  { name: "Share Market" },
  { name: "Rental Income" },
  { name: "Gifts" },
  { name: "Others" },
];

async function seedIncomeCategories() {
  try {
    // Connect to the MongoDB database

    // Clear the IncomeCategory collection before seeding
    await IncomeCategory.deleteMany({});

    // Insert the predefined categories
    await IncomeCategory.insertMany(incomeCategories);

    console.log("Income categories have been seeded successfully!");

    // Disconnect from the database
  } catch (error) {
    console.error("Error seeding income categories:", error);
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
    seedIncomeCategories();
  })
  .catch((err) => {
    console.log("Some Error Occurred While connecting to db", err);
  });
