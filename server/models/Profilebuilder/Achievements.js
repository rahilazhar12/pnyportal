const mongoose = require('mongoose')

const Achievements = new mongoose.Schema({
    AchievementTitle: {
        type: String,
        required: false
    },
    AchievementDescriptions: {
        type: String,
        required: false
    },
});

module.exports = Achievements