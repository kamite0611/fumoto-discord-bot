import { Message } from 'discord.js';

export const helloCommand = async (message: Message) => {
  await message.reply('こんにちは！');
};

export const helpCommand = async (message: Message) => {
  await message.reply('コマンド一覧:\n/hello - こんにちは！');
};

export const saveCommand = async (message: Message) => {
  // const userId = getUserId(message);
  // const userName = getUserName(message);
  // const messageContent = message.content;
  // await message.reply(`ユーザーID: ${userId}\nユーザー名: ${userName}\nメッセージ: ${messageContent}`);
};
