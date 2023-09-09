const express = require('express');
const axios = require('axios')
const bodyParser = require('body-parser');

const WeatherRouter = express.Router();

WeatherRouter.use(bodyParser.json());

WeatherRouter.route('/')
.post((req,res,next)=>{
    var temp;
    var location = req.body.location; // saving location form request body
    console.log("Location body ",location);
    
    //fetching cuurent weather from openweather API
    function weatherOutput(){
        axios.get('https://api.openweathermap.org/data/2.5/weather?q='+location+'&APPID=b80a9cf1772ca5c57371f016150dcb5d&units=imperial')
        .then( (response) => {
            temp = response.data;
            console.log(response);
            res.statusCode =200;
            res.setHeader('Content-Type','application/json');
            res.json(temp)
        },err=>next(err))
        .catch((err)=> next(err));
    }
    weatherOutput();
})

module.exports = WeatherRouter;