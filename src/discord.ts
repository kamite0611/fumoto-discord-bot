import { Message } from "discord.js";

/** Discord ユーザーIDを取得する */
export const getUserId = (message: Message) => {
  return message.author.id;
};

/** Discord ユーザー名を取得する */
export const getUserName = (message: Message) => {
  return message.author.username;
};
