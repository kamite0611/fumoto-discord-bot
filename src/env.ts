import envProduction from "./env.production";

export const env = {
  DISCORD_TOKEN: envProduction.DISCORD_TOKEN,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: envProduction.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: envProduction.GOOGLE_PRIVATE_KEY,
};

if (
  !env.DISCORD_TOKEN ||
  !env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
  !env.GOOGLE_PRIVATE_KEY
) {
  throw new Error("環境変数が設定されていません。");
}
