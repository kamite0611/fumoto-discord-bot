import { Message } from "discord.js";
import { validateDate } from "./libs/google-sheet/date";
import {
  createUserRow,
  getUserRow,
  updateUserRow,
} from "./libs/google-sheet/repository";

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

  const data = await getUserRow(message);
  if (!data) {
    await createUserRow(message, newDate);
    await message.reply(`*Saved:* ${newDate}`);
    return;
  }
  const { rowIndex, userRow } = data;

  const newData = await updateUserRow(rowIndex, message, newDate);
  await message.reply(`*Upddated:* ${userRow.date} -> ${newData.date}`);
};
