const Task=require("../models/Task")
module.exports = async function (taskId,userId) {

    Task.findByIdAndUpdate(
        taskId,
        { $push: { users_done: userId } },
        { new: true }
      ) .then(async (updatedTask) => {
      
       if(updatedTask.users.length==updatedTask.users_done.length){
        await Task.findByIdAndUpdate(taskId,{completed:true},{ new: true })
       }
      })

}