const mongoose=require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/weather_api`);
const userschema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    username:String


})
module.exports=mongoose.model("user",userschema);