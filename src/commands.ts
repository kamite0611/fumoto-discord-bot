import { Message } from "discord.js";
import { validateDate } from "./libs/google-sheet/date";
import {
  createUserRow,
  deleteUserRow,
  getUserRow,
  updateUserRow,
} from "./libs/google-sheet/repository";

export const helpCommand = async (message: Message) => {
  await message.reply(
    `\`\`\`
/get                  Check your data
/save <yyyy-mm-dd>    Save your data
/remove               Remove your data
\`\`\``
  );
};

export const getCommand = async (message: Message) => {
  const data = await getUserRow(message);
  if (!data) {
    await message.reply("*You have not saved your data yet.*");
    return;
  }
  const { userRow } = data;
  await message.reply(`*Your data:* ${userRow.date}`);
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

export const deleteCommand = async (message: Message) => {
  const data = await getUserRow(message);
  if (!data) {
    await message.reply("*You have not saved your data yet.*");
    return;
  }
  const { rowIndex } = data;
  await deleteUserRow(rowIndex, message);
  await message.reply("*Deleted:*");
};
