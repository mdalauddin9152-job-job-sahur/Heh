// ======================
// EXPRESS KEEP-ALIVE
// ======================
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Sigma Bots are running 24/7");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Express alive on port", PORT);
});

// ======================
// MINEFLAYER BOTS
// ======================
const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const mcDataLoader = require("minecraft-data");

const botNames = [
  "sigmasigmadude","sigmaboy2","sigmabroX","sigmaShadowBoy","ultraSigmaBoy",
  "sigmaNovaBot","sigmaPrimeBoy","sigmaByteBoy","sigmaVibeBot","sigmaBot900",
  "sigmaCraftBoy","sigmaCoreBot","sigmaStormBoy","sigmaBotX1","sigmaNightBoy",
  "sigmaEchoBot","sigmaFrostBoy","sigmaSparkBot","sigmaVoidBoy","sigmaTurboBot",
  "sigmaBladeBoy","sigmaGlitchBot","sigmaHunterBoy","sigmaPixelBot","sigmaRogueBoy",
  "sigmaboyX","sigmaboyPro","sigmaboyPlus","sigmaboy999","sigmaboyAlpha",
  "sigmaboyOmega","sigmaboyStrike","sigmaboyBlitz","sigmaboyFlash","sigmaboyOrbit",
  "sigmaboyPulse","sigmaboyCraft","sigmaboyKnight","sigmaboyWing","sigmaboyNova",
  "sigmaboyStorm","sigmaboyByte","sigmaboyShadow","sigmaboyVortex","sigmaboyEcho",
  "sigmaboyFrost","sigmaboyBolt","sigmaboyNexus","sigmaboyUltra","sigmaboyTurbo",
  "sigmaboyZero","sigmaboyPrime","sigmaboyCrafted","sigmaboyGlow",
  "sigmaboySpectre","sigmaboyCyber","sigmaboyMatrix","sigmaboyStealth",
  "sigmaboyRift","sigmaboyGuardian"
];

const SERVER_IP = "play.royallsmp.fun";
const SERVER_PORT = 25565;

function createSigmaBot(name) {
  const bot = mineflayer.createBot({
    host: SERVER_IP,
    port: SERVER_PORT,
    username: name,
    viewDistance: "tiny"
  });

  bot.loadPlugin(pathfinder);

  bot.on("resourcePack", () => {
    console.log(`${name}: Accepting resource pack`);
    bot.acceptResourcePack();
  });

  bot.on("spawn", () => {
    console.log(`${name}: joined`);

    const mcData = mcDataLoader(bot.version);
    const moves = new Movements(bot, mcData);
    bot.pathfinder.setMovements(moves);

    // /register
    setTimeout(() => {
      bot.chat(`/register ${name} ${name}`);
      console.log(`${name}: /register sent`);
    }, 2000);

    // /login
    setTimeout(() => {
      bot.chat(`/login ${name}`);
      console.log(`${name}: /login sent`);
    }, 7000);

    // Chat every 2 minutes
    setInterval(() => {
      bot.chat("gu gu ga ga");
    }, 120000);

    // Movement
    async function movement() {
      try {
        const start = bot.entity.position.clone();
        const yaw = bot.entity.yaw;
        const dx = -Math.sin(yaw);
        const dz = Math.cos(yaw);
        const forward = start.offset(dx * 5, 0, dz * 5);

        await bot.pathfinder.goto(new goals.GoalNear(forward.x, forward.y, forward.z, 1));
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 400);

        await bot.pathfinder.goto(new goals.GoalNear(start.x, start.y, start.z, 1));
      } catch {}
    }

    setTimeout(() => {
      movement();
      setInterval(movement, 300000);
    }, 10000);
  });

  bot.on("end", () => {
    console.log(`${name}: Disconnected, retrying...`);
    setTimeout(() => createSigmaBot(name), 5000);
  });

  bot.on("kicked", (reason) => console.log(`${name}: kicked →`, reason));
  bot.on("error", () => {});
}

console.log("Launching 60 Sigma bots...");
botNames.forEach((name, i) => {
  setTimeout(() => createSigmaBot(name), i * 500);
});
