import { Message } from "discord.js";
import { saveDate } from "./libs/google-sheet/repository";
import { validateDate } from "./utils";

export const helloCommand = async (message: Message) => {
  await message.reply("こんにちは！");
};

export const helpCommand = async (message: Message) => {
  await message.reply("コマンド一覧:\n/hello - こんにちは！");
};

export const saveCommand = async (message: Message) => {
  const newDate = message.content.split(" ")[1];
  if (!validateDate(newDate)) {
    await message.reply("*Please enter in the format:* `/save yyyy-mm-dd`");
    return;
  }

  await saveDate(message, newDate);
  await message.reply(`Saved ${newDate}`);
};
