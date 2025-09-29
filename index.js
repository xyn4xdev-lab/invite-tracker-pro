import { Client, GatewayIntentBits, EmbedBuilder, Collection } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites
  ]
});

const invites = new Map(); // cache of invites per guild

// Ready event
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  for (const [guildId, guild] of client.guilds.cache) {
    try {
      const guildInvites = await guild.invites.fetch();
      invites.set(guildId, new Map(guildInvites.map(inv => [inv.code, inv.uses])));
    } catch (err) {
      console.error(`Failed to fetch invites for ${guild.name}:`, err.message);
    }
  }
});

// Member join tracking
client.on("guildMemberAdd", async (member) => {
  try {
    const cachedInvites = invites.get(member.guild.id);
    const newInvites = await member.guild.invites.fetch();

    const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
    if (usedInvite) {
      const inviter = usedInvite.inviter;
      member.guild.systemChannel?.send(
        `👋 Welcome ${member.user} invited by **${inviter.tag}** (uses: ${usedInvite.uses})`
      );
    }

    invites.set(member.guild.id, new Map(newInvites.map(inv => [inv.code, inv.uses])));
  } catch (err) {
    console.error("Error tracking invite:", err.message);
  }
});

// Slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "invites") {
    const invitesList = await interaction.guild.invites.fetch();
    const userInvites = invitesList.filter(inv => inv.inviter?.id === interaction.user.id);
    const totalUses = userInvites.reduce((sum, inv) => sum + inv.uses, 0);

    const embed = new EmbedBuilder()
      .setTitle("📊 Invite Stats")
      .setDescription(`You have invited **${totalUses}** members.`)
      .setColor("Green");

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (interaction.commandName === "top") {
    const invitesList = await interaction.guild.invites.fetch();
    const leaderboard = {};

    invitesList.forEach(inv => {
      if (inv.inviter) {
        leaderboard[inv.inviter.id] = (leaderboard[inv.inviter.id] || 0) + inv.uses;
      }
    });

    const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const lines = sorted.map(([id, uses], i) => `${i + 1}. <@${id}> — ${uses} invites`);

    const embed = new EmbedBuilder()
      .setTitle("🏆 Invite Leaderboard")
      .setDescription(lines.join("\n") || "No invites yet.")
      .setColor("Gold");

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.BOT_TOKEN);
