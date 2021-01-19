import moment from "moment-timezone";
import { scheduleJob } from "node-schedule";

const inauguration = moment
  .tz("2021-01-20T12:00:00", "America/New_York")
  .toDate();

export default ({
  client: {
    chat: { postMessage },
  },
}) => {
  scheduleJob(inauguration, () => {
    postMessage({
      channel: "chat",
      icon_emoji: ":staycool-biden:",
      text: "I'm the President now.",
      token: process.env.SLACK_TOKEN,
      username: "President Joe Biden",
    });

    setTimeout(() => {
      postMessage({
        channel: "chat",
        icon_emoji: ":see-what-you-did-kamala:",
        text: "And I'm the Vice President.",
        token: process.env.SLACK_TOKEN,
        username: "Vice President Kamala Harris",
      });
    }, 2500);

    setTimeout(() => {
      postMessage({
        channel: "chat",
        icon_emoji: ":staycool-biden:",
        text: "Fuck yeah you are.",
        token: process.env.SLACK_TOKEN,
        username: "President Joe Biden",
      });
    }, 5000);

    setTimeout(() => {
      postMessage({
        channel: "chat",
        icon_emoji: ":see-what-you-did-kamala:",
        text: "Fuck yeah.",
        token: process.env.SLACK_TOKEN,
        username: "Vice President Kamala Harris",
      });
    }, 7500);

    setTimeout(() => {
      postMessage({
        channel: "chat",
        icon_emoji: ":staycool-biden:",
        text: "Murica.",
        token: process.env.SLACK_TOKEN,
        username: "President Joe Biden",
      });
    }, 10000);
  });
};
