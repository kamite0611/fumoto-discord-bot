import { Client, Message } from "discord.js";
import {
  deleteCommand,
  getCommand,
  helpCommand,
  saveCommand,
} from "./commands";
import { DiscordClient } from "./libs/discord";
import { DISCORD_TOKEN } from "./settings";

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
      case "get":
        await getCommand(message);
        break;

      case "save":
        await saveCommand(message);
        break;

      case "remove":
        await deleteCommand(message);
        break;

      case "help":
        await helpCommand(message);
        break;

      default:
        break;
    }
  } else {
    console.log("Not a command message");
  }
}

// Bot起動処理
async function startBot(): Promise<Client> {
  console.log("Starting bot...");

  // Botの準備完了時
  DiscordClient.once("ready", () => {
    console.log(`Bot is ready as ${DiscordClient.user?.tag}`);
  });

  // メッセージ受信時
  DiscordClient.on("messageCreate", async (message) => {
    console.log("Received message:", message.content);
    await handleMessage(message);
  });

  // Botログイン
  try {
    await DiscordClient.login(DISCORD_TOKEN);
    console.log("Bot logged in successfully");
  } catch (error) {
    console.error("Failed to login:", error);
    throw error;
  }

  return DiscordClient;
}

// 直接実行された場合
if (require.main === module) {
  console.log("Starting bot in standalone mode...");
  startBot().catch((error) => {
    console.error("Failed to start bot:", error);
    process.exit(1);
  });
}
