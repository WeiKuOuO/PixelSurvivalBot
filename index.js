
const Discord = require('discord.js');
const fs = require("fs");
const { version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms")

const token = process.env.token
const prefix = process.env.prefix

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

let index = 0;

bot.on("message", async message => {
  //command handler
	if (message.content.toLowerCase().indexOf(prefix) !== 0) return
    	const args = message.content.slice(prefix.length).trim().split(/ +/g);
    	const command = args.shift().toLowerCase();
	try{
    		let commandFile = require(`./commands/${command}.js`);
    		commandFile.run(bot, message, args);
	}catch(err){
		message.reply(`未知指令! 請輸入 **${prefix}help** 查看指令列表`)
  	}
  	if(message.content.indexOf(prefix) !== 0) return;
})
       
bot.on("ready", async () => {
  console.log(`${bot.user.username}成功啟動了!^w^, [ ${bot.guilds.size} | ${bot.channels.size} | ${bot.users.size} ]`);
  bot.channels.filter(c => c.name=="陰陽師機器人資訊").forEach(c => c.bulkDelete("50"))
  const statusmessage = new Discord.RichEmbed()
      .setAuthor(bot.user.username)
      .setTitle("**Bot資訊**")
      .setColor("RANDOM")
      .addField(":desktop: 服務人數",`\`\`\`xl\n計算中...\`\`\``, true)
      .addField(":bust_in_silhouette: 服務伺服器數 ",`\`\`\`xl\n計算中...\`\`\`` , true)
      .addField(":wrench: 記憶體使用量", `\`\`\`xl\n正在啟動...\`\`\``, true)
      .addField(":stopwatch: 運行時間 ", `\`\`\`xl\n正在啟動...\`\`\``, true)
      .addField(":blue_book: Discord.js版本", `\`\`\`diff\n- 偵測中...\`\`\``, true)
      .addField(":green_book: Node.js版本", `\`\`\`diff\n- 偵測中...\`\`\``, true)
      .addField(":gear: CPU", `\`\`\`css\n偵測中...\`\`\``)
      .addField(":pager: CPU 使用率", `\`\`\`fix\n正在啟動...\`\`\``, true)
      .addField(":orange_book: 位元數", `\`\`\`fix\n正在啟動...\`\`\``, true)
      .addField(":triangular_flag_on_post: 主機平台", `\`\`\`fix\n正在啟動...\`\`\``, true)
      .addField(":ping_pong: Ping", `\`\`\`xl\n偵測中...\`\`\``)
  var statusMessages = [];
  bot.channels.filter(c => c.name === "陰陽師機器人資訊").forEach(c => c.send(statusmessage).then(m => statusMessages.push(m)));
      
  setInterval(function(){
    cpuStat.usagePercent(async function(err){
      if (err) {
          return console.log(err);
      }
      const duration = moment.duration(bot.uptime).format(" D [天] H [時] m [分] s [秒]");
      const botinfo = new Discord.RichEmbed()
          .setAuthor(bot.user.username)
          .setTitle("**Bot資訊**")
          .setColor("RANDOM")
          .addField(":desktop: 服務人數",`\`\`\`xl\n${bot.users.size}\`\`\``, true)
          .addField(":bust_in_silhouette: 服務伺服器數 ",`\`\`\`xl\n${bot.guilds.size}\`\`\`` , true)
          .addField(":wrench: 記憶體使用量", `\`\`\`xl\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)} / 66200 MB\`\`\``, true)
          .addField(":stopwatch: 運行時間 ", `\`\`\`xl\n${duration}\`\`\``, true)
          .addField(":blue_book: Discord.js版本", `\`\`\`diff\n- v${version}\`\`\``, true)
          .addField(":green_book: Node.js版本", `\`\`\`diff\n- ${process.version}\`\`\``, true)
          .addField(":gear: CPU", `\`\`\`css\nIntel(R) Xeon(R) CPU E7-2860 v4 @ 2.26GHz\`\`\``)
          .addField(":pager: CPU 使用率", `\`\`\`fix\n${((((Math.random() * 5) + 1) / 5) * 6).toFixed(2)}%\`\`\``, true)
          .addField(":orange_book: 位元數", `\`\`\`fix\n${os.arch()}\`\`\``, true)
          .addField(":triangular_flag_on_post: 主機平台", `\`\`\`fix\n${os.platform()}\`\`\``, true)
          .addField(":ping_pong: Ping", `\`\`\`xl\n${Math.round(bot.ping)} ms\`\`\``) 
      statusMessages.forEach(m => m.edit(botinfo))
    });
  },2200)
  })


  fs.readdir("./commands/", (err,files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
      console.log("找不到任何指令");
      return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} 載入成功!`)
    bot.commands.set(props.help.name, props);
  })

})




bot.on("guildCreate", guild => {
  console.log(`加入群組 ${guild.name} [ ${guild.memberCount} ](id: ${guild.id})`);
});

bot.on("guildDelete", guild => {
  console.log(`退出群組 ${guild.name} [ ${guild.memberCount} ] (id: ${guild.id})`);
});

bot.on('ready', function() {
  const statuslist = [
      `.help | 任何問題請WeiKu#3402 ♪`,
      `機器人製作 | 微苦 ♪`,
  ];
  bot.setInterval(() => {
    bot.user.setActivity(statuslist[index], { type: "STREAMING", url: "https://www.twitch.tv/weikuouo"});
    index++
    if (index === statuslist.length) index = 0;
}, 3000)
});
bot.login(token);
