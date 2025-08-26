# 🔧 Installation Guide

This guide will walk you through setting up Approvarr step-by-step. Choose the method that works best for you!

---

## 🐳 Docker Installation (Recommended)

Docker is the easiest way to get Approvarr running quickly and reliably.

### Prerequisites
- Docker and Docker Compose installed
- Discord bot token
- Overseerr/Jellyseerr instance with API access

### Option 1: Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
services:
  approvarr:
    container_name: approvarr
    image: ghcr.io/nicholg90/approvarr:production
    restart: unless-stopped
    ports:
      - '6000:3000' # Change 6000 to your preferred port
    environment:
      # === REQUIRED SETTINGS ===
      BOT_TOKEN: your_discord_bot_token_here
      CHANNEL_ID: '123456789012345678' # Main Discord channel ID
      SERVER_ID: '123456789012345678' # Discord server ID
      OVERSEERR_URL: 'http://overseerr:5055' # Your Overseerr URL
      OVERSEERR_API_KEY: your_overseerr_api_key_here

      # === OPTIONAL SETTINGS ===
      REQUEST_CHANNEL_ID: '123456789012345678' # Separate channel for requests
      ISSUE_CHANNEL_ID: '123456789012345678' # Separate channel for issues
      ENABLE_SLASH_COMMANDS: 'true' # Enable Discord slash commands
      PORT: '3000' # Internal container port
```

Then run:
```bash
docker-compose up -d
```

### Option 2: Docker Run

```bash
docker run -d \
  --name approvarr \
  --restart unless-stopped \
  -p 6000:3000 \
  -e BOT_TOKEN="your_discord_bot_token" \
  -e CHANNEL_ID="your_channel_id" \
  -e SERVER_ID="your_server_id" \
  -e OVERSEERR_URL="http://your-overseerr:5055" \
  -e OVERSEERR_API_KEY="your_api_key" \
  -e ENABLE_SLASH_COMMANDS="true" \
  ghcr.io/nicholg90/approvarr:production
```

---

## 🛠️ Manual Installation

### Prerequisites
- **Node.js 22+** and npm
- Git
- Discord bot token
- Overseerr/Jellyseerr instance

### Step 1: Clone Repository
```bash
git clone https://github.com/NicholG90/approvarr.git
cd approvarr
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env  # or use your preferred editor
```

### Step 4: Build Project
```bash
npm run build
```

### Step 5: Start Approvarr
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

---

## 🔑 Getting Required Credentials

### Discord Bot Setup

1. **Create Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Navigate to "Bot" section
   - Click "Add Bot"

2. **Get Bot Token**
   - In the Bot section, click "Copy" under Token
   - **⚠️ Keep this secret! Never share your bot token**

3. **Set Bot Permissions**
   - In Bot section, enable these permissions:
     - Send Messages
     - Use Slash Commands
     - Embed Links
     - Read Message History
     - Add Reactions

4. **Invite Bot to Server**
   - Go to OAuth2 > URL Generator
   - Select "bot" and "applications.commands"
   - Select the permissions above
   - Copy the generated URL and visit it to invite the bot

### Discord IDs

**Enable Developer Mode:**
1. Discord Settings → Advanced → Developer Mode (ON)

**Get Server ID:**
1. Right-click your server name → Copy Server ID

**Get Channel ID:**
1. Right-click the channel → Copy Channel ID

### Overseerr/Jellyseerr Setup

1. **Get API Key**
   - Log into Overseerr/Jellyseerr
   - Go to Settings → General → API Key
   - Copy the API key

2. **Configure Webhook (Optional but Recommended)**
   - Go to Settings → Notifications → Webhook
   - Add new webhook: `http://your-server:6000/webhook`
   - Enable desired notification types

---

## 📋 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `BOT_TOKEN` | ✅ | Discord bot token | `randombottoken` |
| `CHANNEL_ID` | ✅ | Main Discord channel ID | `123456789012345678` |
| `SERVER_ID` | ✅ | Discord server ID | `123456789012345678` |
| `OVERSEERR_URL` | ✅ | Overseerr/Jellyseerr URL | `http://overseerr:5055` |
| `OVERSEERR_API_KEY` | ✅ | Overseerr/Jellyseerr API key | `abc123def456ghi789` |
| `REQUEST_CHANNEL_ID` | ❌ | Separate channel for requests | `123456789012345678` |
| `ISSUE_CHANNEL_ID` | ❌ | Separate channel for issues | `123456789012345678` |
| `ENABLE_SLASH_COMMANDS` | ❌ | Enable slash commands | `true` (default) |
| `PORT` | ❌ | Internal port | `3000` (default) |
| `ENABLE_QUOTA_CHECK` | ❌ | Enables Quota Check Slash Command | `true` (default) |

---

## ✅ Verification

After installation, verify everything is working:

### 1. Check Bot Status
- Bot should appear online in Discord
- Check logs for any errors

### 2. Test Slash Commands
```
/request_movie test
/quota_status
```

### 3. Test Webhook (if configured)
- Make a request in Overseerr
- Check if notification appears in Discord

### 4. Check Logs

**Docker:**
```bash
docker logs approvarr
```

**Manual:**
```bash
# Check console output or log files
```

---

## 🔧 Troubleshooting

### Common Issues

**Bot appears offline:**
- Check BOT_TOKEN is correct
- Verify bot has proper permissions
- Check network connectivity

**Commands not appearing:**
- Ensure ENABLE_SLASH_COMMANDS=true
- Bot needs "applications.commands" permission
- Try restarting the bot

**Webhooks not working:**
- Verify webhook URL in Overseerr
- Check firewall/port forwarding
- Ensure bot is reachable from Overseerr

**API errors:**
- Verify OVERSEERR_URL is accessible
- Check OVERSEERR_API_KEY is valid
- Ensure Overseerr/Jellyseerr is running

### Getting Help

- 💬 [Discord Server](https://discord.gg/MPwvd9re) - Live support
- 🐛 [GitHub Issues](https://github.com/nicholg90/approvarr/issues) - Bug reports
- 📖 [Configuration Guide](configuration.md) - Detailed settings
