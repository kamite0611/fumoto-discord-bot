import { Message } from "discord.js";
import {
  formatDate,
  getTargetDate,
  validateDate,
} from "./libs/google-sheet/date";
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
/save <mm-dd>    Save your data
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
  const props = message.content.split(" ")[1];
  if (!validateDate(props)) {
    await message.reply("*Please enter in the format:* `/save mm-dd`");
    return;
  }

  const newDate = getTargetDate(props);

  const data = await getUserRow(message);
  if (!data) {
    await createUserRow(message, newDate);
    await message.reply(`*Saved:* ${formatDate(newDate)}`);
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
  const { rowIndex, userRow } = data;
  await deleteUserRow(rowIndex, message);
  await message.reply(`*Deleted:* ${userRow.date}`);
};
