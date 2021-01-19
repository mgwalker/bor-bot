import bolt from "@slack/bolt";
import { promises as fs } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { dirname } from "./util.js";

const { App, LogLevel } = bolt;

config();

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel[process.env.LOG_LEVEL] || LogLevel.INFO,
});

app.logger.setName("bor003");

const port = process.env.PORT || 3000;
app.start(port).then(async () => {
  app.logger.info(`Bot started on ${port}`);

  const files = (await fs.readdir(join(dirname, "scripts"))).filter(
    (file) => file.endsWith(".js") && !file.endsWith(".test.js")
  );

  files.forEach(async (file) => {
    const script = await import(`./scripts/${file}`); // eslint-disable-line global-require,import/no-dynamic-require
    if (typeof script.default === "function") {
      app.logger.info(`Loading bot script from: ${file}`);
      script.default(app);
    }
  });
});
