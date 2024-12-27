const mongoose = require('mongoose')

const Trainings = new mongoose.Schema({
    Training: {
        type: String,
        required: false
    },
    Institute: {
        type: String,
        required: false
    },
    From: {
        type: String,
        required: false
    },
    To: {
        type: String,
        required: false
    },


});

module.exports = Trainings