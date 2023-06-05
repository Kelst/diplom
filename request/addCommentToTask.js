const Task=require("../models/Task")
module.exports = async function (taskId,comment,user) {
    const newComment = {
        comment: comment,
        user: user
      };
   await Task.findByIdAndUpdate(
        taskId,
        { $push: { comments: newComment } },
        { new: true }
      )
}