const mineflayer = require("mineflayer");
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("Bots running"));
app.listen(10000, () => console.log("Express server running"));

const botNames = [
"sigmaSigmadude","sigmaboy2","sigmabroX","sigmaShadowBoy","ultraSigmaBoy",
"sigmaNovaBot","sigmaPrimeBoy","sigmaByteBoy","sigmaVibeBot","sigmaBot900",
"sigmaCraftBoy","sigmaCoreBot","sigmaStormBoy","sigmaBotX1","sigmaNightBoy",
"sigmaEchoBot","sigmaFrostBoy","sigmaSparkBot","sigmaVoidBoy","sigmaTurboBot",
"sigmaBladeBoy","sigmaGlitchBot","sigmaHunterBoy","sigmaPixelBot","sigmaRogueBoy",
"sigmaboyX","sigmaboyPro","sigmaboyPlus","sigmaboy999","sigmaboyAlpha",
"sigmaboyOmega","sigmaboyStrike","sigmaboyBlitz","sigmaboyFlash","sigmaboyOrbit",
"sigmaboyPulse","sigmaboyCraft","sigmaboyKnight","sigmaboyWing","sigmaboyNova",
"sigmaboyStorm","sigmaboyByte","sigmaboyShadow","sigmaboyVortex","sigmaboyEcho",
"sigmaboyFrost","sigmaboyBolt","sigmaboyNexus","sigmaboyUltra","sigmaboyTurbo",
"sigmaboyZero","sigmaboyPrime","sigmaboyCrafted","sigmaboyGlow","sigmaboySpectre",
"sigmaboyCyber","sigmaboyMatrix","sigmaboyStealth","sigmaboyRift","sigmaboyGuardian"
];

const SERVER_IP = "play.royallsmp.fun";
const SERVER_PORT = 25565;

let index = 0;

function createNextBot() {
  if (index >= botNames.length) return;

  const name = botNames[index];
  console.log(`Starting bot ${index + 1}: ${name}`);

  const bot = mineflayer.createBot({
    host: SERVER_IP,
    port: SERVER_PORT,
    username: name,
    version: false,
    auth: "offline", // cracked
    // Force resource pack auto-download
    hideErrors: true
  });

  bot.on("resourcePack", (url, hash) => {
    bot.acceptResourcePack();
  });

  bot.once("spawn", () => {
    console.log(`${name} joined!`);

    bot.chat(`/register ${name} ${name}`);

    setTimeout(() => {
      bot.chat(`/login ${name}`);
    }, 5000);

    // Chat every 2 min
    setInterval(() => {
      bot.chat("gu gu ga ga");
    }, 120000);

    // Simple movement every 5 min
    setInterval(() => {
      bot.setControlState('forward', true);
      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('jump', true);
        setTimeout(() => {
          bot.setControlState('jump', false);
          bot.setControlState('back', true);
          setTimeout(() => bot.setControlState('back', false), 5000);
        }, 500);
      }, 5000);
    }, 300000);
  });

  bot.on("kicked", (reason) => {
    console.log(`${name} kicked: ${reason}`);
  });

  bot.on("error", (err) => {
    console.log(`${name} error: ${err}`);
  });

  index++;

  // ⏳ delay next bot login by 3 seconds
  setTimeout(createNextBot, 3000);
}

console.log("Starting bots with delay...");
createNextBot();
