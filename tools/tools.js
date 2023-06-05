
module.exports=function  createKeyboard(options) {
    return {
      reply_markup: {
        keyboard: options,
        resize_keyboard: true,
        one_time_keyboard: true,
        
      },
    };
  }
