const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plm = require("passport-local-mongoose");

const passportLocalMongoose = plm.default || plm;


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// passportLocalmongoose is used to automatically implement hashing, salting, username, hashpassword
userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', userSchema);

