module.exports = async (chat_id, bot, msg) => {  

    await bot.deleteMessage(chat_id, msg).catch(e=>{
            console.log(e);
    })
}