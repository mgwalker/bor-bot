const promisify = require('promisify-node');
const fs = promisify('fs');

require('dotenv').config();
const request = require('request');

const bot = require('botkit').slackbot({
  debug: false
});

bot.spawn({
  token: process.env.SLACK_TOKEN,
  retry: Infinity
}).startRTM();

fs.readdir('./scripts')
  .then(paths => {
    for(const path of paths) {
      bot.log(`Loading script at ./scripts/${path}`);
      require(`./scripts/${path}`)(bot)
    }
  });
