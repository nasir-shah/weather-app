const request = require('request')
const forecast = (lon,lat,callback)=>{
    //const url = 'http://api.weatherstack.com/current?access_key=52c6481d6c7c968b00f97edc222ed966&query='+lat+','+ long
    const url = 'http://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon=' +lon+'&units=metric&appid=81e4c997d187d8a7eebaeb16e9be2997'
    request({url:url ,json:true},(error, response)=>{
        if(error){
            callback('Unable to connect to the internet!',undefined)
        }else if(!(response.body.main)){
            callback('Something is wrong with the API call', undefined)
        }else{
            callback(undefined,response.body.main)
        }
    })
}

module.exports = forecast