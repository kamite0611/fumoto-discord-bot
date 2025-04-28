// index.ts
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { Firestore, FieldValue } from '@google-cloud/firestore';
import * as dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

// Firestoreクライアント初期化
const db = new Firestore();

// Discordクライアント初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// メッセージ処理
async function handleMessage(message: Message): Promise<void> {
  // Botのメッセージは無視
  if (message.author.bot) return;
  
  // コマンド処理
  if (message.content.startsWith('!')) {
    // コマンドを取得
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    
    if (!command) return;
    
    // コマンド処理
    switch (command) {
      case 'hello':
        await message.reply('こんにちは！');
        break;
        
      case 'save':
        // データをFirestoreに保存
        const text = args.join(' ');
        await db.collection('userMessages').add({
          userId: message.author.id,
          username: message.author.username,
          message: text,
          timestamp: FieldValue.serverTimestamp()
        });
        await message.reply('メッセージを保存しました！');
        break;
        
      case 'history':
        // ユーザーの履歴を取得
        const snapshot = await db.collection('userMessages')
          .where('userId', '==', message.author.id)
          .orderBy('timestamp', 'desc')
          .limit(5)
          .get();
          
        if (snapshot.empty) {
          await message.reply('履歴がありません');
          return;
        }
        
        let response = '最近のメッセージ:\n';
        snapshot.forEach(doc => {
          const data = doc.data();
          response += `- ${data.message}\n`;
        });
        
        await message.reply(response);
        break;
    }
  }
}

// Bot起動処理
async function startBot(): Promise<Client> {
  // Botの準備完了時
  client.once('ready', () => {
    console.log(`Bot is ready as ${client.user?.tag}`);
  });
  
  // メッセージ受信時
  client.on('messageCreate', handleMessage);
  
  // Botログイン
  await client.login(process.env.DISCORD_TOKEN);
  
  return client;
}

// Cloud Functions HTTPトリガー
export const discordBot = async (req: any, res: any): Promise<void> => {
  try {
    await startBot();
    // Note: 実際の運用では接続を維持する方法を考慮する必要があります
    res.status(200).send('Bot started successfully');
  } catch (error) {
    console.error('Error starting bot:', error);
    res.status(500).send('Failed to start bot');
  }
};

// Discord Webhookハンドラ（代替アプローチ）
export const discordWebhook = async (req: any, res: any): Promise<void> => {
  // Webhookからのリクエストを処理
  // Discordからのイベントに応じて処理を行う
  
  res.status(200).send('Webhook received');
};