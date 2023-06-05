const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema=new Schema({
   userName:{type:String,required:true},
   userIdTelegram:{type:String,required:true},
   userTelegram_nik:{ type:String,default:""} ,
   role:{type:String,enum: ['admin', 'user', ],},
   login:{type:String,required:true},
   number:{type:String,required:true},
})
module.exports=mongoose.model("SystemUser",UserSchema)
