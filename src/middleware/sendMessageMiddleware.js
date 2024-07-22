// sendMessageMiddleware.js
import Slack from "@slack/bolt";

const app = new Slack.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

const sendMessageMiddleware = (createBlocks) => async (req, res, next) => {
  try {
    const blocks = createBlocks(req.body); // Generate blocks using data from req.body
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.SLACK_CHANNEL,
      text: "Hello world from CoMS backend, (This is a test) Image",
      blocks,
    });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send message to Slack");
  }
};

export default sendMessageMiddleware;
