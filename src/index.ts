// index.ts
import * as dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits, Message } from "discord.js";
import { helloCommand, helpCommand } from "./commands";
import { getSpreadsheetData } from "./google";

// Discordクライアント初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// メッセージ処理
async function handleMessage(message: Message): Promise<void> {
  console.log("Processing message:", {
    content: message.content,
    author: message.author.tag,
    isBot: message.author.bot,
  });

  // Botのメッセージは無視
  if (message.author.bot) {
    console.log("Ignoring bot message");
    return;
  }

  // コマンド処理
  if (message.content.startsWith("/")) {
    console.log("Command detected");
    // コマンドを取得
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    console.log("Command details:", { command, args });

    if (!command) {
      console.log("No command found");
      return;
    }

    // コマンド処理
    switch (command) {
      case "hello":
        await helloCommand(message);
        break;

      case "sheet":
        console.log("Executing sheet command");
        try {
          const data = await getSpreadsheetData();
          console.log("data", data);
        } catch (error) {
          console.error("Error in sheet command:", error);
          await message.reply("データの取得に失敗しました。");
        }
        break;

      case "help":
        await helpCommand(message);
        break;

      default:
        console.log("Unknown command:", command);
        await message.reply("不明なコマンドです。");
        break;
    }
  } else {
    console.log("Not a command message");
  }
}

// Bot起動処理
async function startBot(): Promise<Client> {
  console.log("Starting bot...");
  console.log("Environment variables:", {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN ? "Set" : "Not set",
  });

  // Botの準備完了時
  client.once("ready", () => {
    console.log(`Bot is ready as ${client.user?.tag}`);
  });

  // メッセージ受信時
  client.on("messageCreate", async (message) => {
    console.log("Received message:", message.content);
    await handleMessage(message);
  });

  // Botログイン
  try {
    await client.login(process.env.DISCORD_TOKEN);
    console.log("Bot logged in successfully");
  } catch (error) {
    console.error("Failed to login:", error);
    throw error;
  }

  return client;
}

// 直接実行された場合
if (require.main === module) {
  console.log("Starting bot in standalone mode...");
  startBot().catch((error) => {
    console.error("Failed to start bot:", error);
    process.exit(1);
  });
}
