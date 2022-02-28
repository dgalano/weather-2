const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//displays index.html of root path
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

//invoked after hitting go in the html form
app.post("/", function(req, res) {
    
    // takes in the zip from the html form, display in // console. Takes in as string, ex. for zip 02139
    // change zip to city
        var city = String(req.body.cityInput);
        console.log(req.body.cityInput);
    
    //Notes - I don't know what I did wrong at first, but after putting in my own API key, the program stopped working properly. This is my 5th attempt. Suddenly it started to work again. Don't know what I did differently, but it's concerning to me.
    // The answer lies here, api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    // I deleted the &units and got a rediculous number in the 100s. I wanted to keep to the answer as close as possible, but got very far away instead. I tested out the temp and compared it to what google had. What google gave was off by two, but it's close enough, I suppose.
        const units = "imperial";
        const apiKey = "bac32555bf43c6ce68ccbd1136960998";
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +  "&units=" + units + "&APPID=" + apiKey;
    
    // this gets the data from Open WeatherPI
    https.get(url, function(response){
        console.log(response.statusCode);
        
        // gets individual items from Open Weather API
        // add in both humidity and wind speed
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const humid = weatherData.main.humidity;
            const wind = weatherData.wind.speed;
            const city = weatherData.name;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            // displays the output of the results
            res.write("<h1> The weather is " + weatherDescription + "<h1>");
            res.write("<h2>The Temperature in " + city + " is " + temp + " Degrees Fahrenheit. In terms of humidity, it is " + humid + " humid. Winds speeds are going " + wind + " fast. <h2>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
})


//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});

//homwork - change from ZIP to city
