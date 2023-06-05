
const Task=require("../models/Task")
module.exports= async function (userId) {
    try {
      const tasks = await Task.find({ 
        users: { $in: [userId] }, 
        users_done: { $nin: [userId] }
      });
      return tasks;
    } catch (error) {
      // Обробка помилки
      console.error(error);
      return [];
    }
  }