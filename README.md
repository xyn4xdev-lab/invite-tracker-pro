# 📊 Discord Invite Tracker Pro

A modern Discord bot that tracks server invite usage, shows personal stats, and generates leaderboards of the top inviters. Perfect for referral events, giveaways, and community growth tracking.

---

## ⚙️ Features

* Slash command `/invites` → See how many people you’ve invited
* Slash command `/top` → View the top inviters leaderboard
* Tracks which invite link was used when a member joins
* Updates stats automatically when invites are created or used
* Clean, embed-based reports

---

## 🛠️ Installation

```bash
git clone https://github.com/xyn4xdev-lab/discord-invite-tracker-pro.git
cd discord-invite-tracker-pro
npm install
```

---

## 🔧 Setup

1. Copy the environment file and edit it

2. Fill in `.env` with your bot’s credentials:

```
BOT_TOKEN=your-discord-bot-token
CLIENT_ID=your-discord-application-client-id
GUILD_ID=your-test-server-id  # Optional for faster testing
```

---

## 🚀 Deploy Commands

To register the `/invites` and `/top` slash commands:

```bash
node deploy-commands.js
```

* If `GUILD_ID` is set in your `.env`, the commands will register instantly in that server.
* If `GUILD_ID` is **not** set, they will register globally (may take up to 1 hour to appear).

---

## ▶️ Run the Bot

```bash
node index.js
```

---

## 🧠 Notes

* Requires Node.js v16 or higher
* Uses Discord.js v14
* Invite stats reset if you clear your cache or restart without a database (MongoDB/Postgres recommended for persistence)
* Designed for communities that run invite competitions or need growth analytics

---

## 📜 License

This project is open source and available under the [Creative Commons Attribution-NonCommercial 4.0 International License.](./LICENSE).
