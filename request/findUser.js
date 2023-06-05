
const User=require("../models/User")
module.exports = async function (login) {
    let userN= await User.find({login:login})
    return userN;
}