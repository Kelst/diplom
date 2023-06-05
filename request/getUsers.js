
const User=require("../models/User")
module.exports = async function (param) {
    let userN= await User.find({role:param})
    return userN;
}