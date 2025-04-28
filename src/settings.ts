import * as dotenv from "dotenv";

dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.SHEET_ID;
export const GOOGLE_PRIVATE_KEY = process.env.SHEET_NAME;

if (!DISCORD_TOKEN || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
  throw new Error("環境変数が設定されていません。");
}
