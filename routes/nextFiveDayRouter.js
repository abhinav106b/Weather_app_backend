const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const nextFiveRouter = express.Router();
nextFiveRouter.use(bodyParser.json());

nextFiveRouter.route('/')
.post((req,res,next)=>{
    var temp;
    var location = req.body.location;

    //To extract exact 5 day report from 40 3 hour data
    function filterData(arr){
        var filterArray =[];
        var cuurD = new Date();
        cuurD = cuurD.getDate()-1;
        var avg=0;
        arr.map((element)=>{
            var d = new Date(element.dt*1000); //converting unix timestamp into milliseconds
            d= d.getDate();
            avg = avg + element.main.temp; //Taking average temp
            if(d!==cuurD){
                filterArray.push(element);
                cuurD =d
            }
        })
        avg = avg/40;
        filterArray.push({"avg":avg});
        return(filterArray);
    }

    // calls 5day/3hour api from openweathermap and send response
    function responseData(){
        axios.get('https://api.openweathermap.org/data/2.5/forecast?q='+location+'&appid=b80a9cf1772ca5c57371f016150dcb5d&units=imperial')
        .then( (response) => {
            if(response.data.cod === "200"){ //checking does location exist
                console.log("inside 200 ",response.data.cod)
                temp = response.data;
                var FinalData= filterData(temp.list)
                res.statusCode =200;
                res.setHeader('Content-Type','application/json');
                res.json(FinalData);
            }
            else{
                console.log("inside 404 ",response.data.cod)
                res.statusCode =404;
                res.setHeader('Content-Type','application/json');
                res.send("Location not found");
            }
        },err=>next(err))
        .catch((err)=> next(err));
    }
    responseData();
})

module.exports = nextFiveRouter;