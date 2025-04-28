import { Message } from "discord.js";
import { getSpreadsheetData } from "./libs/google-sheets";

export const helloCommand = async (message: Message) => {
  await message.reply("こんにちは！");
};

export const helpCommand = async (message: Message) => {
  await message.reply("コマンド一覧:\n/hello - こんにちは！");
};

export const saveCommand = async (message: Message) => {
  const data = await getSpreadsheetData();
  console.log(data);
};
