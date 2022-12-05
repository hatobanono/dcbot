const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!');
});

app.listen(3000, () => {
  console.log('server started');
});

const Discord = require('discord.js');
const client = new Discord.Client();
const Database = require('@replit/database');
const db = new Database();
const token = process.env['TOKEN']

client.login(token);

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
    console.log(err);
    return;
  }
  //字串分析
  try {
    const prefix = '!'; //前綴符號定義
    if (msg.content.substring(0, prefix.length) === prefix) {
      db.list().then(commandlist => {
        const encommandlist = encodeURIComponent(commandlist);
        //如果訊息的開頭~前綴字長度的訊息 = 前綴字
        const cmd = msg.content.substring(prefix.length).split(' '); //以空白分割前綴以後的字串
        if (cmd.length == 1) {
          switch (cmd[0]) {
            case '阿夸占卜':
              GetRandomAqua();
              break;
            case 'peko占卜':
              GetRandomPeko();
              break;
            case '吃啥':
              GetRandomdinner();
              break;
            default:
              if (IsExist(cmd[0])) {
                GetResponse(cmd[0]);
              }
          }
        } else if (cmd.length == 2) {
          if (cmd[0] === 'delcommand') {
            if (IsExist(cmd[1])) {
              DeleteCommand(cmd[1]);
            } else {
              msg.channel.send(`找不到 ${cmd[1]} 指令`);
            }
          }
        } else if (cmd.length >= 3) {
          switch (cmd[0]) {
            case 'addcommand':
              if (IsExist(cmd[1])) {
                msg.channel.send(`已經有 ${cmd[1]} 指令`);
              } else {
                let text = msg.content.slice(cmd[0].length + cmd[1].length + 3);
                db.set(cmd[1], text);
                msg.channel.send(`增加 ${cmd[1]} 指令`);
              }
              break;
            case 'addrandomlist':
              let randomlist = cmd.slice(2);
              db.set(cmd[1], randomlist);
              msg.channel.send('新增完成');
              break;
          }
        }
        function IsExist(key) {
          return encommandlist.indexOf(encodeURIComponent(key)) >= 0;
        }
        function DeleteCommand(key) {
          db.delete(encodeURIComponent(key)).then(() => {
            msg.channel.send(`刪除 ${cmd[1]} 指令`);
          });
        }
      })
    }
  } catch (err) {
    console.log(err);
    return;
  }
  function GetResponse(key) {
    db.get(encodeURIComponent(key)).then(response => {
      msg.channel.send(response);
    });
  }
  function GetRandomAqua() {
    db.get('randomaqualist').then(randomaquas => {
      msg.channel.send(
        randomaquas[Math.floor(Math.random() * randomaquas.length)]
      );
    });
  }
  function GetRandomPeko() {
    db.get('randompekoralist').then(randompekoras => {
      msg.channel.send(
        randompekoras[Math.floor(Math.random() * randompekoras.length)]
      );
    });
  }
  function GetRandomdinner() {
    db.get('randomdinnerlist').then(randomdinners => {
      msg.channel.send(
        randomdinners[Math.floor(Math.random() * randomdinners.length)]
      );
    });
  }
});
