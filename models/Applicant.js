const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema({
	firstname : String,
    lastname : String,
    email : String,
    phone : String,
    sponsorship : String,
    status: {type: String, default: 'En attente'},
    commission : {type: Number, default: 0},
    createdAt : {type: Date, default: Date.now}

});

const Applicant = mongoose.model('applicants', applicantSchema);

module.exports = Applicant;