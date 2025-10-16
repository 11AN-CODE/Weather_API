 require('dotenv').config();
 const mongoose=require('mongoose');
 
mongoose.connect(process.env.DATABASE_URL) 
    .then(() => console.log("Connected to MongoDB Atlas!"))
    .catch(err => console.error("Connection error:", err));


 const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
 })

module.exports = mongoose.model("user",userSchema)


