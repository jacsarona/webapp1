const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const links = require('./models/links');
const User = require('./models/users');  
const datetimeref = require('./models/date');
var selectedTimeZone;
var timezoneData;
var citezenType;
var flagLink;
var date 
var time;   
var registeredUsers;
var selectedFullname;
var selectedBirthdate;
var selectedNationality;
var selectedFlagLink;
const app = express(); 
const dbURI = 'mongodb+srv://jacsarona:jacsarona@webdevdb.e4srx.mongodb.net/ServerDb?retryWrites=true&w=majority'; 
const worldTimeApiURI = 'http://worldtimeapi.org/api/timezone/';

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
  app.listen(3002);
})
.catch((err) => {
  console.log(err);
});

app.set('view engine', 'ejs');
    
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));

app.get('/', function (req, res) {
  res.render('index', {logo : links.logo, title : 'Home', heading: 'Nengo Pips', sites: links.sites}); 
});

app.get('/user-add', function (req, res) {  
  res.render('form', {logo : links.logo, title : 'Registration',heading : 'Registration Form',  flag: flagLink, nationality: citezenType}); 
});

app.get('/contact', function (req, res) {
  res.render('contact', {logo : links.logo, title : 'Contact',heading : 'Contact Us'}); 
});

app.get('/detail', function (req, res) { 
  User.find().sort({createdAt: -1})
    .then((result) => { 
      registeredUsers = result;
      res.render('detail', {logo : links.logo, title : 'Detail',heading : 'Detail', users: result, date : date, time: time, flag: flagLink}); 
    })
    .catch((err) => {
      console.log(err);
    });
 });

app.get('/user', function (req, res) {
  res.render('form', {logo : links.logo, title : 'View',heading : 'User Information',  flag: selectedFlagLink, nationality: citezenType, fname: selectedFullname, bdate: selectedBirthdate, nat: selectedNationality}); 
});
//Post Routes

//TimeZone Submitted
app.post('/detail', (req, res) =>{
  selectedTimeZone = req.body.timezone;   
  if(selectedTimeZone == 'America/New_York'){
    flagLink = links.flags.america[1];
    citezenType = links.flags.america[0];
  }
  else if(selectedTimeZone == 'Asia/Tokyo'){
    flagLink = links.flags.china[1];
    citezenType = links.flags.china[0];
  }
  else if(selectedTimeZone == 'Asia/Manila'){
    flagLink = links.flags.philippines[1];
    citezenType = links.flags.philippines[0];
  }
  else if(selectedTimeZone == 'Europe/Moscow'){
    flagLink = links.flags.russia[1];
    citezenType = links.flags.russia[0];
  }
  else if(selectedTimeZone == 'Europe/Stockholm'){
    flagLink = links.flags.sweden[1];
    citezenType = links.flags.sweden[0];
  }
  
  if(selectedTimeZone != null){
    fetch(worldTimeApiURI + selectedTimeZone)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) { 
      timezoneData = data;
      //format number month to word
      date = datetimeref.month[timezoneData['datetime'][5] + timezoneData['datetime'][6]];
      date += ' ' + timezoneData.datetime[8] + timezoneData.datetime[9];
      date += ', ' + timezoneData.datetime[0] + timezoneData.datetime[1] + timezoneData.datetime[2] + timezoneData.datetime[3];

      //format hour
      time = datetimeref.hour[timezoneData.datetime[11] + timezoneData.datetime[12]][0];
      time += ':' + timezoneData.datetime[14] + timezoneData.datetime[15];
      time += ':' + timezoneData.datetime[17] + timezoneData.datetime[18];
      time += ' ' + datetimeref.hour[timezoneData.datetime[11] + timezoneData.datetime[12]][1];
       
      res.redirect('/detail'); 
    })
    .catch((err) => {
      console.log(err);
    }); 
  }
  else{
    res.redirect('/');
  }  
});

//New User Submitted then Save to database
app.post('/new-user', (req, res) =>{  
  const user = new User({
    'fullname': req.body.name,
    'birthDate':req.body.date,
    'nationality': req.body.nationality,
  }); 
  user.save()
    .then((result) => { 
      res.redirect('/detail');
    })
    .catch((err) => {
      console.log(err);
    }); 
});

app.post('/user-view', (req, res) => { 
  if(registeredUsers != null){
    for(user of registeredUsers){ 
      if(req.body.userId == user._id){
        selectedFullname = user.fullname;
        selectedBirthdate = user.birthDate
        selectedNationality = user.nationality;
        if(user.nationality == links.flags.america[0]){
          selectedFlagLink = links.flags.america[1]; 
        }
        else if(user.nationality == links.flags.china[0]){
          selectedFlagLink = links.flags.china[1]; 
        }
        else if(user.nationality == links.flags.philippines[0]){
          selectedFlagLink = links.flags.philippines[1]; 
        }
        else if(user.nationality == links.flags.russia[0]){
          selectedFlagLink = links.flags.russia[1]; 
        }
        else if(user.nationality == links.flags.sweden[0]){
          selectedFlagLink = links.flags.sweden[1]; 
        }
        res.redirect('/user');
      }
    } 
  } 
  else{
    res.redirect('/');
  }
});


//Page Not Found
app.use((req, res) => { 
  res.render('404', {logo : links.logo, title: 'Error 404',heading : 'Error 404: Page not Found'})
}); 