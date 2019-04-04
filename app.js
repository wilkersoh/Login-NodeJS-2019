const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
 
// Passport config
require('./config/passport')(passport);

// DB 
const db = require('./config/keys').MongoURL;

// Connect mongo
mongoose.connect(db, {
    useNewUrlParser: true
}).then(()=>console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts); // must above ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(session({ // get from github express-session
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
// Passport middleware after session
app.use(passport.initialize());
app.use(passport.session());
// connect flash
app.use(flash());
// Global var
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT ||5000;
app.listen(PORT, console.log(`You are Listening port ${PORT}`));