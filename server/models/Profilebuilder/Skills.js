const mongoose = require('mongoose')

const Skills = new mongoose.Schema({
    Skill: {
        type: String,
        required: false
    },
    SkillLevel: {
        type: String,
        required: false
    },
    SkillSummary: {
        type: String,
        required: false
    },

});

module.exports = Skills