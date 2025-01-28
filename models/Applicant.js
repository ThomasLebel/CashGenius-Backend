const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema({
	firstname : String,
    lastname : String,
    email : String,
    phone : String,
    sponsorship : String,
    createdAt : {type: Date, default: Date.now}

});

const Applicant = mongoose.model('applicants', applicantSchema);

module.exports = Applicant;