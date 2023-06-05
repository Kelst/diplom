const userId = 'USER_ID'; // Замініть на фактичний ідентифікатор користувача



const Task=require("../models/Task")
module.exports = async function (userId) {
   
let res=Task.find({ users: { $in: [userId] } })

    return res;
}

