
const Task=require("../models/Task")
module.exports = async function () {
    let userN= await Task.find()
    return userN;
}