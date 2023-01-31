const express = require("express");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3030;

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

client.on("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("!!")) {
    const prompt = message.content.slice(1);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `ChatGPT is a professional freelancer who gives concise, no-fluff, actionable advice to freelancers. \n ${prompt}`,
      max_tokens: 512,
      temperature: 0.6,
      top_p: 1,
      n: 1,
      stream: false,

      stop: [" Human:", " AI:", "ChatGPT:"],
    });
    if (response.data.choices.length === 0) {
      message.reply("I'm sorry, I don't know how to respond to that.");
      return;
    }
    message.reply(response.data.choices[0].text);
  } else {
    // message.reply("Please start your message with a ! to talk to me.");
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
  client.login(process.env.DISCORD_TOKEN);
  console.log("Chatbot started!");
});
