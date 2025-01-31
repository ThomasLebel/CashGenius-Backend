const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname : String,
    lastname : String,
    email : String,
    password : String,
    token: String,
    referralCode: String,
    referralClicks : Number,
    referredUsers: [
        {
            referredUserInfos: {type: mongoose.Schema.Types.ObjectId, ref: "applicants"}

        }
    ]
});

const User = mongoose.model('users', userSchema);

module.exports = User;