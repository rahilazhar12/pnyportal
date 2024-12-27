const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_Compas)
        // await mongoose.connect(process.env.DB_Compas)
        console.log(`Database connected successfully...!`.bgGreen)
    } catch (error) {
        console.log(`Error in Database connection...!`.bgRed)

    }
}

module.exports = dbConnection