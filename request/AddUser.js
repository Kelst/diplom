
const User=require("../models/User")
module.exports = async function (req) {
    const newUser=new User({
        userName:"Vlad",
        userIdTelegram:"384042079",
        userTelegram_nik:"@bezkorov",
        role:"admin",
        login:"admin",
        number:"0951470082"
        
    });
    const newUser1=new User({
        userName:"VladUser",
        userIdTelegram:"384042079",
        userTelegram_nik:"@bezkorov",
        role:"user",
        login:"user",
        number:"0951470082"
    
        
    });
    try{
    await newUser1.save()
    return newUser1
    }
    catch(er){
        return({
            message:"Error newUser"
        })
    }




}