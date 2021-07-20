const Discord = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const db = new Database()
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  //前置判斷
    try {
        if (!msg.guild || !msg.member) return; //訊息內不存在guild元素 = 非群組消息(私聊)
        if (!msg.member.user) return; //幫bot值多拉一層，判斷上層物件是否存在
        if (msg.member.user.bot) return; //訊息內bot值為正 = 此消息為bot發送
    } catch (err) {
        return;
    }
        //字串分析
    try {
        const prefix = '!' //前綴符號定義
        if (msg.content.substring(0, prefix.length) === prefix) //如果訊息的開頭~前綴字長度的訊息 = 前綴字
        {
          db.list().then(commandlist => {
            console.log('列表'+ commandlist);
            const cmd = msg.content.substring(prefix.length).split(' '); //以空白分割前綴以後的字串

            if (cmd.length == 1) {
              if (commandlist.indexOf(cmd[0]) >= 0) {
                db.get(cmd[0]).then(response => {
                  msg.channel.send(response);
                  console.log('回覆'+ response);
                });
              };
            };

            if (cmd.length == 2, cmd[0] == 'delcommand') {
              if (commandlist.indexOf(cmd[1]) >= 0) {
                db.delete(cmd[1]);
                msg.channel.send('刪除 '+ cmd[1] +' 指令');
              }else {
                msg.channel.send('找不到 '+ cmd[1] +' 指令');
              }
            };

            if (cmd.length >= 3, cmd[0] == 'addcommand') {
              if (commandlist.indexOf(cmd[1]) >= 0) {
                msg.channel.send('已經有 '+ cmd[1] +' 指令');
              }else {
                const text = msg.content.slice(cmd[0].length + cmd[1].length + 2);
                console.log('內容'+text);
                db.set(cmd[1], text);
                msg.channel.send('增加 '+ cmd[1] +' 指令');
              }
            }
          });
        }
    } catch (err) {
        console.log('OnMessageError', err);
    }
});

client.login('');
