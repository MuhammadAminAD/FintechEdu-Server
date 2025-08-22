import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TG_BOT_TOKEN);

bot.catch((err, ctx) => {
      console.error(`Botda xato [${ctx.updateType}]:`, err);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

(async () => {
      try {
            await bot.telegram.deleteWebhook();
            await bot.launch();
            console.log("🤖 Bot ishga tushdi");
      } catch (err) {
            console.error("Botni ishga tushirishda xato:", err);
      }
})();

export default bot;
