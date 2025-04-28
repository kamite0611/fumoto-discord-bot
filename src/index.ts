// index.ts
import { Client, GatewayIntentBits, Message } from "discord.js";
import * as dotenv from "dotenv";
import { JWT } from "google-auth-library";
import { google } from "googleapis";
import { helloCommand, helpCommand } from "./commands";

// 環境変数の読み込み
dotenv.config();

// Google Sheets APIの設定
const SPREADSHEET_ID = "1EgCnN36YyzSGZn9EFX_fIbnbk2c4Uc2BHWC0EmXOaZQ";

// サービスアカウントの認証
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Discordクライアント初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// スプレッドシートからデータを取得
async function getSpreadsheetData(range: string) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    });
    return response.data.values;
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    throw error;
  }
}

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
          const data = await getSpreadsheetData("Sheet1!A1:D10");
          if (data && data.length > 0) {
            const response = data.map((row) => row.join(" | ")).join("\n");
            await message.reply("```\n" + response + "\n```");
          } else {
            await message.reply("データが見つかりませんでした。");
          }
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
