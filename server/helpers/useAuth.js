const bcrypt = require('bcrypt')

exports.Hashedpassword = async (password) => {
    try {
        let hashedpassword = await bcrypt.hash(password, 10)
        return hashedpassword
    } catch (error) {
        console.log(error)
    }

}


exports.comparePassword = async (password, userpassword) => {
    return await bcrypt.compare(password, userpassword)
}