const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema({
	firstname : String,
    lastname : String,
    email : String,
    phone : String,
    referal : String,
    createdAt : {type: Date, default: Date.now}

});

const Applicant = mongoose.model('applicants', applicantSchema);

module.exports = Applicant;