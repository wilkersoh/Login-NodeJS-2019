const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// User model
const User = require('../models/User');

// Login 
router.get('/login', (req, res) => {
    res.render('login');
})

// Register 
router.get('/register', (req, res) => {
    res.render('register');
})

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2){ //if true
        errors.push({msg: 'Please fill in all fields!'})
    }

    if(password !== password2){
        errors.push({msg: "Passwrods do not match"});
    }

    // check the password length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0) {
        res.render('register',{
            // danger的资料
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation password
        User.findOne({ email: email})
          .then(user =>{
              if(user){
                // 对查
                errors.push({ msg: 'Email is alredy register'})
                res.render('register',{ 
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
              } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // 对密码加密 hash(原密码， salt)
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    // hash 加密后的密码 
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                      .then(user => {
                          req.flash('success_msg', 'You are now register')
                          res.redirect('/users/login')
                      })
                      .catch(err => console.log(err));
                }))
              }
          })

    }

});

// Login handle page
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next)
})
 
// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;