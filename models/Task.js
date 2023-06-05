const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const TaskSchema=new Schema({
   text:{type:String,required:true},
   userIdTelegram:{type:String},
   users:[{ type: Schema.Types.ObjectId, ref: 'SystemUser' ,default:[]}],
   users_done:[{ type: Schema.Types.ObjectId, ref: 'SystemUser' ,default:[]}],
   comments: { type:[{
      comment:String,
      user:String
  }],default:[]},
   completed:{type:Boolean,required:true,default:false},
})
module.exports=mongoose.model("Task",TaskSchema)
 