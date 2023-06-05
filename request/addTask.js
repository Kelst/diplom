
const Task=require("../models/Task")
module.exports = async function (req) {


    
    const newTask=new Task({
        text:req.text,
        userIdTelegram:req.userIdTelegram,
        users:req.users,
        comments:[],
        completed:false
        
    });
   
    try{
    await newTask.save()
    return newTask
    }
    catch(er){
        return({
            message:"Error newTask"+er
        })
    }




}