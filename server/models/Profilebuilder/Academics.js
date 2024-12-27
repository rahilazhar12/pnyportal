const mongoose = require('mongoose')

const Academics = new mongoose.Schema({
    degreeLevel: {
        type: String,
        required: false
    },
    degree: {
        type: String,
        required: false
    },
    institute: {
        type: String,
        required: false
    },
    majorsubjects: {
        type: String,
        required: false
    },
    startdate: {
        type: String,
        required: false
    },
    completiondate: {
        type: String,
        required: false
    },
    Country: {
        type: String,
        required: false
    },
    markspercentage: {
        type: String,
        required: false
    },
    positionholder: {
        type: String,
        required: false
    },
    gradingcriteria: {
        type: String,
        required: false
    },

});

module.exports = Academics