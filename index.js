// ================================
//  EXPRESS KEEP-ALIVE SERVER
// ================================
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Sigma Bots Running 24/7");
});

app.listen(PORT, () => {
  console.log("Keep-alive server running on port " + PORT);
});

// ================================
//  MULTI-BOT SYSTEM
// ================================
const mineflayer = require("mineflayer");

const BOT_COUNT = 60; // number of bots
const SERVER_HOST = "play.royallsmp.fun"; // your server ip
const SERVER_PORT = 25565; // your server port
const RESOURCE_PACK = true; // force bots to use resource pack

console.log(`Starting ${BOT_COUNT} Sigma Bots...`);

function createBot(i) {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: `SigmaBot_${i}`,
    skipValidation: true,
    hideErrors: false,
    auth: "offline", // cracked server
    disableChatSigning: true,
    enableCaveBot: false,
    enableMovement: true,
    checkTimeoutInterval: 10 * 1000,
    acceptResourcePacks: "always" // IMPORTANT
  });

  // --- auto rejoin on kick ---
  bot.on("kicked", (reason) => {
    console.log(`Bot ${i} kicked:`, reason);
    setTimeout(() => createBot(i), 5000);
  });

  bot.on("error", (err) => {
    console.log(`Bot ${i} error:`, err);
  });

  // --- when bot spawns ---
  bot.once("spawn", () => {
    console.log(`Bot ${i} joined the server.`);

    // SIMPLE AFK WALK (no pathfinder)
    setInterval(() => {
      bot.setControlState("forward", true);
      setTimeout(() => bot.setControlState("forward", false), 1000);
    }, 6000);

    // OPTIONAL: look around randomly
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * 0.5;
      bot.look(yaw, pitch, true);
    }, 4000);
  });

  return bot;
}

// Start bots
for (let i = 1; i <= BOT_COUNT; i++) {
  createBot(i);
}
