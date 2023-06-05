
const Task=require("../models/Task")
module.exports = async function (id) {
    let task= await Task.find({_id:id})
    return task;
}