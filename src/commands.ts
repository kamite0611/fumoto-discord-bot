import { Message } from 'discord.js';

export const helloCommand = async (message: Message) => {
  await message.reply('こんにちは！');
};

export const helpCommand = async (message: Message) => {
  await message.reply('コマンド一覧:\n/hello - こんにちは！');
};
