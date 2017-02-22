const promisify = require('promisify-node');
require('dotenv').config();

const fs = promisify('fs');

const bot = require('botkit').slackbot({
  debug: false
});

bot.spawn({
  token: process.env.SLACK_TOKEN,
  retry: Infinity
}).startRTM();

fs.readdir('./scripts')
  .then((paths) => {
    for (const path of paths) {
      bot.log(`Loading script at ./scripts/${path}`);
      require(`./scripts/${path}`)(bot); // eslint-disable-line
    }
  });
