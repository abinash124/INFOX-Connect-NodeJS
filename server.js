//Load express module
const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const passport=require('passport');
//const nodemailer= require('nodemailer');

const xoauth2=require('xoauth2');

const users=require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts');

//const admin=require('./routes/api/admin');
//const email=require('/routes/api/email');


const app= express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB config URI
const db=require('./config/keys').mongoURI;

// Connect to mongodb
mongoose
    .connect(db)
    .then(()=> console.log('Database connected'))
    .catch(err=> console.log('err'));



//Passport middleware

app.use(passport.initialize());

//Passport config

require('./config/passport')(passport);


//Use default routes
//Route to /api/ for default route
app.use('/api/users',users);
//app.use('/api/admin',admin);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

//process.env.PORT to deploy on Heroku
// 5000 to run locally
const port= process.env.PORT || 5000;
app.listen(port);


