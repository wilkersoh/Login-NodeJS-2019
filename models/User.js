const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    password:{
        type: String,
        trim: true,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;