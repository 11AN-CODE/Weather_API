const  express=require('express');
const app=express();
const usermodel=require('./models/users');
const bcrypt=require("bcrypt");
const cookies = require('cookie-parser');
const jwt=require("jsonwebtoken");
const axios = require('axios');
const port = process.env.PORT || 5000




app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookies());
 
function isLoggedIn(req,res,next){
    if(!req.cookies.token){
        res.redirect('/login')
    }
    try{
        let data=jwt.verify(req.cookies.token,"hhhh")
        next()
    }catch(error){
        console.error("JWT Verification Error:", error.message);
        // Redirect to login on any verification error
        res.redirect('/login');
    }

}


app.get('/',(req,res)=>{
    res.render('index');
})

app.post('/register',async (req,res)=>{
    let{name,email,password}=req.body;

    let alreadyregsitered= await usermodel.findOne({email});
    if(alreadyregsitered) return res.status(500).send("USer already registered");

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
       let registeredUser= await usermodel.create({
        name,
        email,
        password:hash

})
 let token=jwt.sign({email:email,userid:registeredUser._id},"hhhh")
    res.cookie('token',token);
    res.send(registeredUser);
    
    



        })
    })

   






    

})



app.get('/login',(req,res)=>{
    res.render('login')
})


app.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    let loggedin=await usermodel.findOne({email})
    if(!loggedin){
        console.log("Not Login")
    }
    else{
        bcrypt.compare(password,loggedin.password,(err,result)=>{
            if(result){
                let token=jwt.sign({email:email,userid:loggedin._id},"hhhh")
                res.cookie('token',token)
                res.redirect('/dashboard')
                


            }
             else res.redirect('/login')
        })

    }

   
})


app.get('/dashboard', isLoggedIn, (req, res) => {
  // Pass null values to prevent the EJS template from throwing an error
  res.render('dashboard', { weatherData: null, error: null });
});

app.get("/weather", isLoggedIn, (req, res) => {
  res.render("dashboard", { weatherData: null, error: null });
});

app.get('/fetch-weather', isLoggedIn, async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.render('dashboard', { weatherData: null, error: 'City parameter is required' });
    }

    // Access the environment variable directly from the process.env object
    const API_KEY = process.env.WEATHER_API_KEY;

    // A check to ensure the key is set, which is good practice
    if (!API_KEY) {
        console.error("Error: WEATHER_API_KEY environment variable is not set.");
        return res.render('dashboard', { weatherData: null, error: 'Internal server error: API key missing.' });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(apiUrl);
        const weatherData = response.data;
        
        // Render the weather page with the fetched data
        res.render('dashboard', { weatherData: weatherData, error: null });
    } catch (error) {
        console.error("Weather API error:", error.response ? error.response.data : error.message);
        const errorMessage = error.response && error.response.status === 400
            ? 'Invalid city or location.'
            : 'Error fetching weather data. Please try again.';

        // Render the weather page with an error message
        res.render('dashboard', { weatherData: null, error: errorMessage });
    }
});






app.get('/logout',(req,res)=>{ //..means not render jo cookie jiss name se set kari thi usse bas blank krdo
    res.clearCookie('token'); 
    
    res.redirect('/login');
});



app.listen(port,()=>{
    console.log(`server running on ${port}` )

});