const express= require('express');
const app=express();
const user_accnt=require('./models/users');
const bcrypt=require("bcrypt");
const cookies = require('cookie-parser');
const jwt=require("jsonwebtoken");
const axios=require("axios");
const API_KEY = "7f382d5763a5a01928f37cdf58b1c3be";



app.set('view engine',"ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));




app.get('/',(req,res)=>{
    res.render('index');

})
function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.status(401).send("You are not authenticated.");
    }
    
    try {
        // Verify the token using the same secret key you used for signing
        const decodedToken = jwt.verify(req.cookies.token, "bbbbbb"); 
        
        // Attach the decoded user data to the request object
        req.user = decodedToken;
        
        // Call next() to proceed to the next middleware or route handler
        next();
        
    } catch (err) {
        // Handle cases where the token is invalid or expired
        return res.status(403).send("Invalid or expired token.");
    }
}
app.post('/register',async(req,res)=>{
    let{email,password,name,username}=req.body;
    let already_regitser=await user_accnt.findOne({email})
    if(already_regitser){
        return res.send("User already registered,please login");
    }
    bcrypt.genSalt(10,async(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
        let user_register= await user_accnt.create({
        
        name:name,
        email:email,
        password:hash,
        username:username
    })

        })
    })
   
    res.redirect('/login');
})

app.get('/login',(req,res)=>{
    res.render('login')
})



app.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    let user_login=await user_accnt.findOne({email});
    if(!user_login){
        res.status(400).send("user not registered");

    }
    try {
        const isMatch = await bcrypt.compare(password, user_login.password);

        if (isMatch) {
            let tt = jwt.sign({ email: user_login.email, id: user_login._id }, "bbbbbb");
            res.cookie("token", tt);
            return res.redirect('/some-protected-route');
        } else {
            return res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});

app.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.redirect('/login');
})


app.get('/weather/:city',(req,res)=>{
    const city=req.params.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7f382d5763a5a01928f37cdf58b1c3be&units=metric`;
    try {
        // Use await to wait for the API response
        const response = await axios.get(url);
        const weatherData = response.data;

        // Extract and format the specific data you want
        const weatherInfo = {
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            conditions: weatherData.weather[0].description
        };

        // Send the formatted data as a JSON response
        res.json(weatherInfo);
    } catch (err) {
        // Handle errors, such as a city not being found (404)
        if (err.response && err.response.status === 404) {
            return res.status(404).json({ message: "City not found." });
        }
        console.error(err);
        return res.status(500).json({ message: "Error fetching weather data." });
    }
})

app.listen(3000);
