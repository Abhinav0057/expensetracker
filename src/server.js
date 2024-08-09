


const mongoose = require("mongoose");

mongoose.set('strictQuery', false);


mongoose.connect("mongodb+srv://mongolearn:mongolearn@cluster0.yldrtwz.mongodb.net/expense_tracker?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log("Some Error Occurred While connecting to db", err);
})




