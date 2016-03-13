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
  token: process.env.SLACK_TOKEN
}).startRTM();

botkit.on("ambient", (bot, msg) => {
  isNerfHerder(msg.user).then(is => {
    if(is) {
      if(Math.random() >= 0.90) {
        bot.reply(msg, `<@${msg.user}> No.`);
      }
    }
  });
  //console.log("Got something")
  //bot.reply(msg, "No.");
});
