const Discord = require("discord.js")
const Database = require("@replit/database")
const keepAlive = require("./server")

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
        const encommandlist = encodeURIComponent(commandlist);
        console.log('列表' + commandlist);
        const cmd = msg.content.substring(prefix.length).split(' '); //以空白分割前綴以後的字串

        if (cmd.length == 1) {
          switch (cmd[0]) {
            case '阿夸占卜':
              db.get("randomaqualist").then(randomaquas => {
                msg.channel.send(randomaquas[Math.floor(Math.random() * randomaquas.length)]);
              });
              break;

            case '吃啥':
              db.get("randomdinnerlist").then(randomdinners => {
                msg.channel.send(randomdinners[Math.floor(Math.random() * randomdinners.length)]);
              });
              break;

            case 'peko占卜':
              db.get("randompekoralist").then(randompekoras => {
                msg.channel.send(randompekoras[Math.floor(Math.random() * randompekoras.length)]);
              });
              break;

            default:
              if (encommandlist.indexOf(encodeURIComponent(cmd[0])) >= 0) {
                db.get(encodeURIComponent(cmd[0])).then(response => {
                  msg.channel.send(response);
                  console.log('回覆' + response);
                });
              };
          }
        };

        if (cmd.length == 2) {
          if (cmd[0] == 'delcommand') {
            if (encommandlist.indexOf(encodeURIComponent(cmd[1])) >= 0) {
              db.delete(encodeURIComponent(cmd[1]));
              msg.channel.send('刪除 ' + cmd[1] + ' 指令');
            } else {
              msg.channel.send('找不到 ' + cmd[1] + ' 指令');
            }
          }
        };

        if (cmd.length >= 3) {
          switch (cmd[0]) {
            case 'addcommand':
              if (encommandlist.indexOf(encodeURIComponent(cmd[1])) >= 0) {
                msg.channel.send('已經有 ' + cmd[1] + ' 指令');
              } else {
                const text = msg.content.slice(cmd[0].length + cmd[1].length + 3);
                console.log('內容 ' + text);
                db.set(cmd[1], text);
                msg.channel.send('增加 ' + cmd[1] + ' 指令');
              }
              break;
            case 'addrandomlist':
              const randomlist = cmd.slice(2)
              db.set(cmd[1], randomlist);
              break;
          }
        }
      });
    }
  } catch (err) {
    console.log('OnMessageError', err);
  }
});

keepAlive()
client.login(process.env.TOKEN);