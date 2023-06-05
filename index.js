const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config();
const mongoose = require('mongoose');
const createKeyboard= require("./tools/tools");
const AddUser = require('./request/AddUser');
const { find } = require('./models/User');
const findUser = require('./request/findUser');
const getUsers = require('./request/getUsers');
const addTask = require('./request/addTask');
const getAllTask = require('./request/getAllTask');
const getTask = require('./request/getTask');
const getUsersFromTask = require('./request/getUsersFromTask');
const deleteTask = require('./request/deleteTask');
const { createCanvas, loadImage } = require('canvas');
const sendDiagram = require('./tools/sendDiagram');
const getTaskIdUser = require('./request/getTaskIdUser');
const addCommentToTask = require('./request/addCommentToTask');
const doneTask = require('./request/doneTask');
const getDoneTaskUser = require('./request/getDoneTaskUser');
const getNotDoneTask = require('./request/getNotDoneTask');
const getDataForChart = require('./request/getDataForChart');
const getDataForChartN = require('./request/getDataForChartN');

// const removeMessage= require("./tools/removeMessage")
// const deleteAllMessage = require('./tools/deleteAllMessage');
// const generateFourDigitNumber=require("./tools/tools")

const Task={
    text:"",

}
const YesNoKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Так', callback_data: 'yes' },
          { text: 'Ні', callback_data: 'no' }
        ]
      ]
    }
  };
let userData={
    name:"Vlad",
    login:"admin",
    number:"0951470082",
    role:"user"
}
let AdminkeyboardOptions=[]
let UserkeyboardOptions=[]
const bot = new TelegramApi(process.env.TOKKEN, { polling: true });
//підключення монго
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log('Connect DB'));
let state={
    status:"",
    data:"",
    code:"",
    name:"",
    login:"",
    number:"",
    role:"",
    userId:""
    

}



bot.onText(/\/start/, async (msg) => {  
 const chatId = msg.chat.id;
  const keyboardOptions = [
    ['log in'],
    
  ];
   state={
    status:"",
    data:"",
    code:"",
    name:"",
    login:"",
    number:"",
    role:""
   
}
 
  const keyboard = createKeyboard(keyboardOptions,);
  bot.sendMessage(chatId, 'Привіт!Я IntelliBot вибери наступну дію :', keyboard);


 });
 bot.onText(/log in/, async (msg, match) => {
  
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Введіть свій логін:`)
    state.status="login"

  });
  
  bot.onText(/resend the message/, async (msg, match) => {
        const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Введіть свій логін:`)
    mode.status="verification"
    state.code="1111"
    bot.sendMessage(chatId, `Вам надіслано смс повідомлення,\nВведіть отриманий код: `)

  });

  bot.onText(/Створити завдання/, async (msg, match) => {
    if(state.role=="admin")
   { const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Введіть текст завдання`)
    state.status="create_task"}

  });
  
  bot.onText(/Переглянути завдання/, async (msg, match) => {
    if(state.role=="user")
   {
     const chatId = msg.chat.id;
     const user=await findUser(state.login)
     
     let tasks= await getNotDoneTask(user[0]._id)
    const inline=tasks.map(e=>[{text:e.text,callback_data:`user_task_${e._id}`}])
    console.log(inline);
    const taskKeyboard = {
        reply_markup: {
          inline_keyboard: [
            ...inline
            
          ]
        }
      };
    bot.sendMessage(chatId, `Список ваших завдань:`,taskKeyboard)
    state.status="user_task"}

  });

  bot.onText(/Додадкова інформація про завдання/, async (msg, match) => {
    if(state.role=="admin")
   { const chatId = msg.chat.id;
   
    const taskKeyboard = {
        reply_markup: {
          inline_keyboard: [
            
             [{ text:"Показати діаграму виконаних завдань", callback_data: `show_info_1`}],
             [{ text: "Показати діаграму не виконаних завдань",callback_data: `show_info_2`}],
            
          ]
        }
      };
    bot.sendMessage(chatId, `Виберіть наступні опції:`,taskKeyboard)
    state.status="show_info"}

  }); 
  //Переглянути  статистику
  bot.onText(/Переглянути  статистику/, async (msg, match) => {
    if(state.role=="user"){
    const chatId = msg.chat.id;
   
    //Виконані завдання:
    const done_task=await getDoneTaskUser(state.userId)
    //не виконані завдання
    const ndone_task=  await getNotDoneTask(state.userId)  
    if(done_task.length>0){
        bot.sendMessage(chatId,`Виконані завдання (${done_task.length}):\n`)
        const message=done_task.map(e=>`Завдання: ${e.text}\nКомент:\n${e.comments.length==0?'Немає коментів':e.comments.map(e=>e.comment+'\n').join('')}`).join("")
       await bot.sendMessage(chatId,message,createKeyboard(UserkeyboardOptions))
    }
     if(( ndone_task).length>0){
        await bot.sendMessage(chatId,`Не виконані завдання (${ndone_task.length}):\n`)
        const message=ndone_task.map(e=>`Завдання: ${e.text}\nКомент:\n${e.comments.length==0?'Немає коментів':e.comments.map(e=>e.comment+'\n').join('')}`).join("")
        bot.sendMessage(chatId,message,createKeyboard(UserkeyboardOptions))
    }
    if(done_task.length==0&&ndone_task.length==0)
    {
        bot.sendMessage(chatId,"У вас немає жодних завдань")
    }

}   


})
  bot.onText(/Керувати завданнями/, async (msg, match) => {
    if(state.role=="admin"){
    const chatId = msg.chat.id;
    const task=await getAllTask();
    if(task.length!=0)
   {
    
    let inline_keyboard=task.map(e=>{
        return [{ text: e.text, callback_data: `control_task_${e._id}`}]
    })
    const taskKeyboard = {
        reply_markup: {
          inline_keyboard: [
            
              ...inline_keyboard
            
          ]
        }
      };
    bot.sendMessage(chatId, `Список всіх завдань:`,taskKeyboard)
    state.status="control_task"
}else  bot.sendMessage(chatId, `Немає жодного завдання`,createKeyboard(AdminkeyboardOptions))
   


}

  });











  bot.on("message",async (msg)=>{
      const chatId = msg.chat.id;
    if(state.status==="login"){
      
      state.data=msg.text;
      
      // шукаємо логін у базі даних
    
    userData={
    name:"default",
    login:"default",
    number:"default",
    role:"default"
               }
userData1=await findUser(  state.data)
if(userData1.length==0){
    userData={
        name:"default",
        login:"default",
        number:"default",
        role:"default"
           }
        
        }else {
            userData.name=userData1[0].userName
            userData.login=userData1[0].login
            userData.number=userData1[0].number
            userData.role=userData1[0].role
            state.userId=userData1[0]._id
        }
if(state.data==userData.login){
    state.code="1111"
    //відправка повідомлення тут
    state.status="verification"
    
    bot.sendMessage(chatId, `Користувач із логіном: ${state.data} знайдений, вам надіслано смс повідомлення,\nВведіть отриманий код: `)
}else{
    bot.sendMessage(chatId,`Користувач із логіном: ${state.data} не знайдений, введіть логін:` )
    state.data=msg.text;
    state.status="login"
}

    }else  if(state.status==="verification"){console.log("Ver");
       state.data=msg.text;
       if(state.code==state.data){
        
           state.status="logged in"
           state.data=""
           state.code=""
           state.name=userData.name
           state.login=userData.login
           state.role=userData.role
           state.number=userData.number
           let keyboard 
           if(state.role=="admin")
           { AdminkeyboardOptions = [
               ['Створити завдання'],//ми описуємо завдання, далі вибираємо передати завдання, всім або певним користувачам
               ['Керувати завданнями'],//видалення, редагування
               ['Додадкова інформація про завдання'],//тут можна глянути статус завдання,коли закінчено,кількість виконаних завдань
               
             ]
             keyboard = createKeyboard(AdminkeyboardOptions,);
            }else   if(state.role=="user")
             { UserkeyboardOptions = [
                 ['Переглянути завдання'],//є можливість переглянути всі завдання, закрити завдання,написати коментар
                 ['Переглянути  статистику'],//буде діаграма проста.
                 
               ];
               keyboard = createKeyboard(UserkeyboardOptions,);
            }

          
       
           bot.sendMessage(chatId,`Доброго дня: ${userData.name} виберіть наступні дії:`,keyboard )
       }else {
           const keyboardOptions = [
               ['log in'],
               ['resend the message'],
               
             ];
           const keyboard = createKeyboard(keyboardOptions,);
           bot.sendMessage(chatId,`Невірний код, виберіть наступні дії:`,keyboard )
       }
   }else if(state.status==="create_task"&&state.role=="admin"){
    Task.text=msg.text;
    
    bot.sendMessage(chatId, `Завдання : ${Task.text}\nВідправити всім ?`,YesNoKeyboard)


   } else if(state.status=="add_comment"&&state.role=="user"){
    const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Додати комент', callback_data: `add_comment_${Task.id}` }
            ]
          ]
        }
      };
      Task.comment=msg.text;
      state.status="user_task"
      state.data=msg.text
      bot.sendMessage(chatId, `Ваш комент: ${msg.text}`,keyboard)

   } else  if(state.status=="add_done"&&state.role=="user"){
    const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Завершити завдання', callback_data: `done_task_${Task.id}` }
            ]
          ]
        }
      };
      Task.comment=msg.text;
      state.status="user_task"
      state.data=msg.text
      bot.sendMessage(chatId, `Ваш комент: ${msg.text}`,keyboard)

   }
   
  })


//колбеки

// { text: 'Виконати', callback_data: `done_task_${idTask}` },
//                   { text: 'Додати комент', callback_data: `add_comment_${idTask}` }

bot.on('callback_query', async(query) => {
    const chatId = query.message.chat.id; 
	const data = query.data;
    if(data.startsWith("add_comment_")&&state.role=="user"&&state.status=="user_task"){
        const idTask=data.split("add_comment_")[1]
        await addCommentToTask(idTask,state.data,state.name)
        bot.sendMessage(chatId,"Комент додано",createKeyboard(UserkeyboardOptions))
        state.status=""
    }else if(data.startsWith("done_task_")&&state.role=="user"&&state.status=="user_task"){
        const idTask=data.split("done_task_")[1]
        await doneTask(idTask,state.userId)
        bot.sendMessage(chatId,"Завдання  виконано")
        state.status=""
    }else

    if(data.startsWith("add_")&&state.role=="user"&&state.status=="user_task"&&!data.includes("task")){
        const idTask=data.split("add_")[1]
        Task.id=idTask
        bot.sendMessage(chatId,"Введіть ваш коментар:",)
        state.status="add_comment"
      
    }else if(data.startsWith("done_")&&state.role=="user"&&state.status=="user_task"&&!data.includes("task")){
        const idTask=data.split("done_")[1]
        Task.id=idTask
        bot.sendMessage(chatId,"Введіть комент для закриття завдання завдання:")
        
        state.status="add_done"
    }


   

})


bot.on('callback_query', async(query) => {
    const chatId = query.message.chat.id; 
	const data = query.data;
    if(data.startsWith("user_task_")&&state.role=="user"&&state.status=="user_task"){
        const idTask=data.split("user_task_")[1]
        const task=await getTask(idTask)
        const keyboard = {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Виконати', callback_data: `done_${idTask}` },
                  { text: 'Додати комент', callback_data: `add_${idTask}` }
                ]
              ]
            }
          };
        bot.sendMessage(chatId, `Завдання : ${task[0].text}\n`,keyboard)

    
    }


})


bot.on('callback_query', async(query) => {
    const chatId = query.message.chat.id; 
	const data = query.data;
    
    if(data.startsWith("show_info_1")&&state.role=="admin"&&state.status=="show_info"){
       const data= await getDataForChart()
       
    await sendDiagram(chatId,bot,data.taskCountArray,data.userNameArray)
    }else
    if(data.startsWith("show_info_2")&&state.role=="admin"&&state.status=="show_info"){
       
        const data= await getDataForChartN()
       
     await sendDiagram(chatId,bot,data.taskCountArray,data.userNameArray)
        }


})


bot.on('callback_query', async(query) => {
    const chatId = query.message.chat.id; 
	const data = query.data;
    console.log(data.startsWith("control_task_"));
    if(data.startsWith("control_task_")&&state.role=="admin"&&state.status=="control_task"){
        const idTask=data.split("control_task_")[1]
        const task=await getTask(idTask)
        const usersFromTask= await getUsersFromTask(idTask)
        console.log(usersFromTask);
        let inlineKeyboard = {
            reply_markup: {
              inline_keyboard: [
                [
                    { text: `Видалити завдання`, callback_data: `control_delete_${task[0]._id}` }
                ],
                [
                    { text: `Відправити смс виконавцям`, callback_data: `control_send_${task[0]._id}` }
                ]
                
              ]
            }
          };
        bot.sendMessage(chatId,`Завдання:\n${task[0].text}\nВиконано: ${task[0].completed?"Так ":"Ні"}
\nКоментарі:${task[0].comments.map(e=>e.comment+'('+e.user+')\n').join()}\nВиконавці:${usersFromTask.map(e=>e.userName).join('\n')}`,inlineKeyboard)
    }else  if(data.startsWith("control_delete_")&&state.role=="admin"&&state.status=="control_task"){
        const idTask=data.split("control_delete_")[1]
        let flag=deleteTask(idTask)
        if(flag){
            bot.sendMessage(chatId,`Завдання видалено!`,createKeyboard(AdminkeyboardOptions))
            state.status=""
           

        }

        
    }else if(data.startsWith("control_send_")&&state.role=="admin"&&state.status=="control_task"){
        const idTask=data.split("control_send_")[1] 
        const users=await getUsersFromTask(idTask);
        users.forEach(e=>{
            bot.sendMessage(e.userIdTelegram,`Завдання надіслано повторно: ${idTask}`,createKeyboard(AdminkeyboardOptions))

            const keyboard = {
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: 'Додати комент', callback_data: `add_comment_${idTask}` }
                    ]
                  ]
                }
              };       })
        state.status=""

    }
})

bot.on('callback_query', async(query) => {
    const chatId = query.message.chat.id; 
	const data = query.data;
    console.log(data.startsWith("send_"));
    let keyboard=createKeyboard(AdminkeyboardOptions)
       // Зберігаємо таску в базу даних
       const users=await getUsers("user")
       const userId=users.map(e=>e.userIdTelegram)//отримали ід користувачів
       const usersId=users.map(e=>e._id)//отримали ід користувачів
       let inline=users.map(e=>{
       return { text: `Користувач: ${e.userName}`, callback_data: `send_${e.userIdTelegram}_${e._id}_${e.userName}` }
    })
    let inlineKeyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              ...inline
            ]
          ]
        }
      };
    if (data === 'yes'&&state.status=="create_task") {
   
      
      const req={
        text:Task.text,
        userIdTelegram:chatId,
        users:usersId
      }
    await addTask(req)
    userId.forEach(async e=>{
         bot.sendMessage(e,`Ви отримали нове завдання`)

    })

      //Робимо запит на користувачів, берем їх id та надсилаємо повідомлення
      bot.sendMessage(chatId, `Завдання збережено в базу даних, та надіслано всім користувачам`,keyboard)
      state.status=""
      Task.text=""
      
    } else if (data === 'no'&&state.status=="create_task") {
       
       
        bot.sendMessage(chatId, `Виберіть кого призначити:`,inlineKeyboard)
    }else if (data.startsWith("send_")&&state.status=="create_task") {
        const regex = /send_(.*?)_/g;
        const matches = [];
        let match;
        
        while ((match = regex.exec(data)) !== null) {
          matches.push(match[1]);
        }
        const idTel = matches[0];
        const idUs = matches[1];
        const userName = matches[2];

      const req={
        text:Task.text,
        userIdTelegram:chatId,
        users:[idUs]
      }
    await addTask(req)
    console.log("ddsddsd"+inlineKeyboard.reply_markup.inline_keyboard[0][0]);
    inline=inline.filter(e=>e.text.includes(userName))
    console.log(inline);
    if (inline.length==0)
    {
        bot.sendMessage(chatId, `Завданян відправлено користувачу`,keyboard)
        state.status=""
    }else
{
    bot.sendMessage(chatId, `Завданян відправлено користувачу`,inlineKeyboard)

}
    bot.sendMessage(idTel,`Ви отримали нове завдання`)

    }
  });

  // Запуск бота
  bot.on('polling_error', (error) => {
    console.log(error);
  });
  
  
  


    
   