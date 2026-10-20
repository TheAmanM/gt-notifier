import { Client, Intents, MessageEmbed, TextChannel } from "discord.js";
import "puppeteer";
import "dotenv/config";
import puppeteer from "puppeteer";
import cron from "cron";
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const botThumbnailUrl = "https://i.ibb.co/cwY0DTg/GT-Notifier.png";

// Join link: https://discord.com/api/oauth2/authorize?client_id=1009230168738508830&permissions=8&scope=bot
// Fetch url: https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-o-level/grade-threshold-tables/

/* async function initialize() {
  // TODO: Init browser, fetch guilds and channels
  /* client.channels.fetch("1009229121148162128").then((val) => {
    if (val) {
      console.log(val);
    } else {
      console.log("No channel found!");
    }
  }); 
} */
async function getAnnouncementsChannel(): Promise<TextChannel> {
  return (await client.channels.fetch("596661697104838666")) as TextChannel;
  // return client.channels.cache.get("596661697104838666") as TextChannel;
}

/* async function loop(): Promise<void> {
  const epochTime = 1660791600000;
  console.log("Event loop begun at", new Date().getTime());
  console.log("Target:", new Date(epochTime));
  // const epochTime = new Date().getTime() + 30000;
  // while (new Date().getTime() < epochTime) {}
  while (true) {
    if (new Date().getTime() >= epochTime) break;
  }
  console.log("Epoch time passed!");
  try {
    const channel = await getAnnouncementsChannel();
    sendRelease(channel);
  } catch (error) {
    console.log("Message error:", error);
  }
  return;
} */

/* async function fetchData(): Promise<string> {
  console.log("Making request...");
  const scrapeUrl =
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-o-level/grade-threshold-tables/";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(scrapeUrl).catch((e) => {
    console.log("Erorr:", e);
    return "";
  });
  await page.waitForSelector(".maincontent-wrap");
  let urls = await page.$$eval("div.yui3-c ul > li", (links) => {
    // links.forEach((link) => {
    //   if (link.querySelector("a")?.textContent?.includes("2021")) {
    //     return link.querySelector("a")?.href;
    //   }
    // });
    return links.map((link) => {
      console.log("Value:", link.querySelector("a")?.textContent);
      return link.querySelector("a")?.href ?? "";
    });
  });
  browser.close();

  // Handle search logic here
  urls.forEach((url) => {
    if (url.includes("2021")) {
      console.log("URL Found:", url);
      return url;
    }
  });

  for (let i = 0; i < urls.length; i++) {
    if (urls[i].includes("2021")) {
      scheduled.stop();
      return url;
    }
  }
  console.log("No result:", new Date().getTime());
  return "";
} */

function sendRelease(channel: TextChannel): void {
  const embed = new MessageEmbed()
    .setTitle("Grade Thresholds are almost out!")
    .setDescription(
      "It is 7:58! It is now the time set for the thresholds to be released! Good luck!\n\u200b"
    )
    .setThumbnail(botThumbnailUrl)
    .addFields(
      {
        name: "Facebook Link",
        value: "https://www.facebook.com/OALevelResources/",
      },
      {
        name: "Facebook Post link",
        value:
          "https://oalevelresources.com/gce-caie-june-2022-expected-grade-thresholds-for-igcse-o-level-as-a-level/",
      },
      {
        name: "Cambridge Website",
        value:
          "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-o-level/grade-threshold-tables",
      }
    )
    .setTimestamp();
  channel.send({
    embeds: [embed],
    content: "We got news, <@&985234904314945556>!",
  });
}

/* let url = "";
let scheduled = new cron.CronJob("00 * * * * *", async () => {
  console.log("Fetch");
  // url = await fetchData();
}); */

client.on("ready", async () => {
  if (client.user) {
    console.log("Client ready as", client.user.tag);

    // scheduled.start();
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.id === process.env.OWNER_ID) {
    if (message.content === ";test") {
      sendRelease(await getAnnouncementsChannel());
      return;
    } else if (message.content.indexOf(";say") === 0) {
      const arr = message.content.split(" ");
      arr.shift();
      let channel = await getAnnouncementsChannel();
      channel.send(arr.join(" "));
      message.delete();
      return;
    }
  }
  if (client.user) {
    if (message.content === ";info" || message.mentions.has(client.user.id)) {
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Info")
            .setDescription(
              `${client.user.username} is a bot that will notify all **@Memers** when the Grade Thresholds for CAIE O-Levels 2022 are released. It will also share links to make navigation easier. `
            )
            .setThumbnail(botThumbnailUrl)
            .setTimestamp()
            .setFooter({
              text: message.author.username,
              iconURL: message.author.avatarURL()!,
            }),
        ],
      });
    }
  }
  return;
});

client.login(process.env.BOT_TOKEN);
