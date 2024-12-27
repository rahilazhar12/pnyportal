const mongoose = require('mongoose')

const Certification = new mongoose.Schema({
    Certification: {
        type: String,
        required: false
    },
    Institutee: {
        type: String,
        required: false
    },
    ValidTill: {
        type: String,
        required: false
    },

});

module.exports = Certification