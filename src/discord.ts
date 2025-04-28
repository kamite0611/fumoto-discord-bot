import { Client, GatewayIntentBits, Message } from "discord.js";

// Discordクライアント初期化
export const DiscordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

/** Discord ユーザーIDを取得する */
export const getUserId = (message: Message) => {
  return message.author.id;
};

/** Discord ユーザー名を取得する */
export const getUserName = (message: Message) => {
  return message.author.username;
};
