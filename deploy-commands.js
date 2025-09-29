import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("invites")
    .setDescription("Show how many people you’ve invited."),
  new SlashCommandBuilder()
    .setName("top")
    .setDescription("Show the top inviters leaderboard.")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log("🔄 Refreshing application (/) commands...");

    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log("✅ Successfully registered guild commands.");
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log("✅ Successfully registered global commands.");
    }
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
})();
