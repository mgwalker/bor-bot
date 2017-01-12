"use strict";

require("dotenv").config();
const request = require("request");

const botkit = require("botkit").slackbot({
  debug: false
});

const targetUsername = process.env.USERNAME || "nfreader";

let nfreaderID = null;
function isNerfHerder(userID) {
  if(!nfreaderID) {
    return new Promise((resolve) => {
      request.post("https://slack.com/api/users.info", { form: { token: process.env.SLACK_TOKEN, user: userID }}, (err, res, body) => {
        let isHim = false;
        let response = JSON.parse(body);
        if(response.ok) {
          if(response.user.name === targetUsername) {
            nfreaderID = userID;
            isHim = true;
          }
        }
        resolve(isHim);
      });
    });
  }

  if(nfreaderID === userID) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
}

botkit.spawn({
  token: process.env.SLACK_TOKEN,
  retry: Infinity
}).startRTM();

botkit.hears(['.*'], ['direct_mention'], (bot, msg) => {
  console.log('heard a direct mention');
  isNerfHerder(msg.user).then(is => {
    if(is) {
      bot.reply(msg, `<@${msg.user}> No.`);
    } else {
      bot.reply(msg, `<@${msg.user}> Yes.`);
    }
  })
})

botkit.on("ambient", (bot, msg) => {
  isNerfHerder(msg.user).then(is => {
    if(is) {
      let chance = 0.1;
      if(msg.text.length > 200) {
        // 100% chance if a message is 1,500 characters or
        // more.
        chance = Math.max(1, 0.2 + (msg.text.length / 1875));
      }

      if(Math.random() <= chance) {
        bot.reply(msg, `<@${msg.user}> No.`);
      }
    }
  });
});
