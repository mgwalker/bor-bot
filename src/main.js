require("dotenv").config();
const { App, LogLevel } = require("@slack/bolt");
const fs = require("fs").promises;
const path = require("path");

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel[process.env.LOG_LEVEL] || LogLevel.INFO,
});

app.logger.setName("bor003");

const port = process.env.PORT || 3000;
app.start(port).then(async () => {
  app.logger.info(`Bot started on ${port}`);

  const files = (await fs.readdir(path.join(__dirname, "scripts"))).filter(
    (file) => file.endsWith(".js") && !file.endsWith(".test.js")
  );

  files.forEach((file) => {
    const script = require(`./scripts/${file}`); // eslint-disable-line global-require,import/no-dynamic-require
    if (typeof script === "function") {
      app.logger.info(`Loading bot script from: ${file}`);
      script(app);
    }
  });
});
