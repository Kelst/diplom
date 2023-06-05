

const Task=require("../models/Task")
module.exports = async function (id) {
    let task= await Task.findById(id)
    .populate('users')
    const users = task.users;
    return users;
}
