const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    positionTitle: {
        type: String,
        required: false
    },
    from: {
        type: Date,
        required: false
    },
    to: {
        type: Date,
        required: false
    },
    companyName: {
        type: String,
        required: false
    },
    jobLevel: {
        type: String,
        required: false
    },
    jobResponsibilities: {
        type: String,
        required: false
    }
});

module.exports = jobSchema