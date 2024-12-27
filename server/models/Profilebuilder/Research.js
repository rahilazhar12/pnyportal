const mongoose = require('mongoose')

const Research = new mongoose.Schema({
    ResearchTitle: {
        type: String,
        required: false
    },
    PublicationVenue: {
        type: String,
        required: false
    },
    PublicationLink: {
        type: String,
        required: false
    },

});

module.exports = Research