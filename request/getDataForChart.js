const User=require("../models/User")
const Task=require("../models/Task")



module.exports= async function () {
    try {
      const users = await User.find({ role: "user" });
      const userIds = users.map((user) => user._id);
  
      const completedTasks = await Task.aggregate([
        { $match: { users_done: { $in: userIds } } },
        { $group: { _id: "$users_done", count: { $sum: 1 } } }
      ]);
  
      const userNameArray = [];
      const taskCountArray = [];
  
      users.forEach((user) => {
        const completedTask = completedTasks.find((task) =>
        task._id.toString() === user._id.toString()
        );
        const taskCount = completedTask ? completedTask.count : 0;
  
        userNameArray.push(user.userName);
        taskCountArray.push(taskCount);
      });
      console.log(userNameArray);
      console.log(taskCountArray);
      return { userNameArray, taskCountArray };
    } catch (error) {
      // Обробка помилки
      console.error(error);
      return { userNameArray: [], taskCountArray: [] };
    }
  }