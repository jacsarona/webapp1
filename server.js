const express = require('express'); 
const weather = require('weather-js'); 
const months = require('./month');
const imageLinks = require('./imageLinks');

 
weather.find({search: 'Davao, PH', degreeType: 'C'}, function(err, result) {
  if(err) console.log(err);
  
    const app = express(); 

    app.set('view engine', 'ejs');
    app.listen(3001); 

    app.get('/', function (req, res) {
      res.render('index', {logo : imageLinks.logo, title : 'Home', imgUrl : imageLinks.flag, cityWeatherData : result[0], monthName : months.monthNames, weatherIcons : imageLinks.weatherLinks}); 
    })

    app.get('/other', function (req, res) {
      res.render('other', {logo : imageLinks.logo, title : 'Other',heading : 'Other Page'}); 
    })

    app.use((req, res) => {
      res.render('404', {logo : imageLinks.logo, title: 'Error 404',heading : 'Error 404: Page not Found'})  
    })
 
}); 
 

 