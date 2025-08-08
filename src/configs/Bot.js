import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TG_BOT_TOKEN);
export default bot
bot.launch();