const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mongoose User Model
const User = require('../models/User');
 
module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Match User
            User.findOne({email: email})
              .then(user => {
                  if(!user){
                    return done(null, false, { message: "That Email is not registered"})
                  }
                // Match password (原生密码, 来自db的密码)
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Password is incorrect'})
                    }
                })
              })
              .catch(err => console.log(err))
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}