const Task=require("../models/Task")
module.exports = async function (id) {
    let flag=false;
    Task.findOneAndDelete({_id:id},async function(err,doc){
        try{
            flag=true
        }
        catch(err){
            flag=false
        }
    });

return flag;


}