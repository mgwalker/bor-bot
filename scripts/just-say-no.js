const knownUserIDs = { };

const sayNoAdminUsername = process.env.SAY_NO_ADMIN || false;
let sayNoToUsername = process.env.SAY_NO_TO || false;

function noop() { }

function isTarget(targetUsername, bot, msg) {
  if (!targetUsername) {
    return Promise.reject();
  }

  if (!knownUserIDs[targetUsername]) {
    return new Promise((resolve, reject) => {
      bot.api.users.info({ user: msg.user }, (err, response) => {
        if (response.ok) {
          if (response.user.name === targetUsername) {
            knownUserIDs[targetUsername] = msg.user;
            return resolve({ bot, msg });
          }
        }
        return reject();
      });
    });
  }
  if (knownUserIDs[targetUsername] === msg.user) {
    return Promise.resolve({ bot, msg });
  }
  return Promise.reject();
}

function justSayNo({ bot, msg }) {
  let chance = 0.10;
  if (msg.text.length > 200) {
    // 100% chance if a message is 1,500 characters or more.
    chance = Math.max(1, 0.2 + (msg.text.length / 1875));
  }

  if (Math.random() <= chance) {
    bot.reply(msg, `<@${msg.user}> No.`);
  }
}

function setTarget({ bot, msg }) {
  bot.api.users.info({ user: msg.match[1] }, (error, response) => {
    if (!error && response.ok) {
      sayNoToUsername = response.user.name;
      bot.reply(msg, `Okay, poor ol' <@${msg.match[1]}> will be the target now.`);
    } else {
      bot.log(error);
      bot.reply(msg, 'Something went wrong!');
    }
  });
}

function clearTarget({ bot, msg }) {
  sayNoToUsername = false;
  bot.reply(msg, 'Okay, I\'ll stop being mean.');
}

function ambientResponse(bot, msg) {
  isTarget(sayNoToUsername, bot, msg).then(justSayNo).catch(noop);
}

function dmSetTarget(bot, msg) {
  isTarget(sayNoAdminUsername, bot, msg).then(setTarget).catch(noop);
}

function dmClearTarget(bot, msg) {
  isTarget(sayNoAdminUsername, bot, msg).then(clearTarget).catch(noop);
}

module.exports = function connectHandlers(bot) {
  bot.on('ambient', ambientResponse);
  bot.hears(['say no to <@(\\S*?)(\\|\\S*)?>'], 'direct_message', dmSetTarget);
  bot.hears(['stop saying no'], 'direct_message', dmClearTarget);

  bot.log('just-say-no script initialized');
};
