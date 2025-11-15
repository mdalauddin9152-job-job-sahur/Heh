const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const mcDataLoader = require("minecraft-data");

// === BOT LIST (60 usernames) =======================================
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

// === SERVER CONFIG ==================================================
const HOST = "play.royallsmp.fun";
const PORT = 25565;

// === BOT FUNCTION ===================================================
function createSigmaBot(name) {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: name,
    viewDistance: "tiny",
    hideErrors: true
  });

  bot.loadPlugin(pathfinder);

  // Auto-accept server resource packs
  bot.on("resourcePack", (url, hash) => {
    console.log(name, "accepted resource pack:", url);
    bot.acceptResourcePack();
  });

  bot.once("spawn", () => {
    console.log(name, "joined!");

    const mcData = mcDataLoader(bot.version);
    const movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements);

    // /register
    setTimeout(() => {
      bot.chat(`/register ${name} ${name}`);
      console.log(name, "sent /register");
    }, 2000);

    // /login
    setTimeout(() => {
      bot.chat(`/login ${name}`);
      console.log(name, "sent /login");
    }, 7000);

    // Chat every 2 minutes
    setInterval(() => {
      bot.chat("gu gu ga ga");
    }, 120000);

    // Movement every 5 minutes
    async function moveRoutine() {
      try {
        const startPos = bot.entity.position.clone();
        const yaw = bot.entity.yaw;

        const dx = -Math.sin(yaw);
        const dz = Math.cos(yaw);

        const targetPos = startPos.offset(dx * 5, 0, dz * 5);

        await bot.pathfinder.goto(new goals.GoalNear(targetPos.x, targetPos.y, targetPos.z, 1));

        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 300);

        await bot.pathfinder.goto(new goals.GoalNear(startPos.x, startPos.y, startPos.z, 1));
      } catch (e) {
        console.log(name, "movement error:", e);
      }
    }

    // Start movement after 10 seconds
    setTimeout(() => {
      moveRoutine();
      setInterval(moveRoutine, 300000);
    }, 10000);
  });

  bot.on("end", () => {
    console.log(name, "disconnected! Reconnecting in 5s...");
    setTimeout(() => createSigmaBot(name), 5000);
  });

  bot.on("kicked", (reason) => console.log(name, "kicked:", reason));
  bot.on("error", () => {});
}

// === START ALL 60 BOTS ==============================================
console.log("Starting all 60 Sigma Bots...");
botNames.forEach((name, i) => {
  setTimeout(() => createSigmaBot(name), i * 500); // prevents spam-join at once
});
