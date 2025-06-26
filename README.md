# 🎬 Approvarr

**A powerful Discord bot that seamlessly integrates Overseerr/Jellyseerr with Discord for streamlined media requests and issue management.**

[![GitHub Release](https://img.shields.io/github/v/release/nicholg90/approvarr)](https://github.com/nicholg90/approvarr/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/nicholg90/approvarr)](https://hub.docker.com/r/nicholg90/approvarr)
[![Discord](https://img.shields.io/discord/123456789?label=Discord&logo=discord)](https://discord.gg/MPwvd9re)
[![License](https://img.shields.io/github/license/nicholg90/approvarr)](https://github.com/nicholg90/approvarr/blob/main/LICENSE.md)

---

## ✨ What is Approvarr?

Approvarr bridges the gap between **Overseerr/Jellyseerr** and **Discord**, bringing your media management workflow directly into your Discord server. Say goodbye to switching between apps - manage everything from Discord!

### 🚀 Key Features

- **🎯 Slash Commands** - Request movies & TV shows directly in Discord
- **⚡ Real-time Management** - Approve, decline, and comment on requests instantly
- **🔧 Issue Reporting** - Report and track media issues with detailed forms
- **📊 Quota Management** - Built-in request limits with status tracking
- **🎛️ Flexible Configuration** - Custom channels, permissions, and workflows
- **🐳 Easy Deployment** - Simple Docker-based setup
- **🔄 Webhook Integration** - Real-time updates from Overseerr/Jellyseerr

---

## 🎬 How It Works

### For Users
1. **Request Media** - Use `/request_movie` or `/request_tv` with any title
2. **Select from Results** - Choose the correct match from search results
3. **Season Selection** - For TV shows, pick specific seasons or all
4. **Submit & Track** - Request goes to admins, get real-time updates

### For Administrators
1. **Receive Notifications** - New requests appear in your Discord channel
2. **One-Click Actions** - Approve/decline with Discord buttons
3. **Issue Management** - Handle user reports directly in Discord
4. **Real-time Updates** - Webhook integration keeps everything synced

---

## 🚀 Quick Start

### Docker (Recommended)

```yaml
# docker-compose.yml
services:
  approvarr:
    container_name: approvarr
    image: ghcr.io/nicholg90/approvarr:latest
    ports:
      - '6000:3000'
    environment:
      # Required
      BOT_TOKEN: your_discord_bot_token
      CHANNEL_ID: discord_channel_id
      SERVER_ID: discord_server_id
      OVERSEERR_URL: 'http://your-overseerr:5055'
      OVERSEERR_API_KEY: your_overseerr_api_key

      # Optional
      REQUEST_CHANNEL_ID: separate_requests_channel
      ISSUE_CHANNEL_ID: separate_issues_channel
      ENABLE_SLASH_COMMANDS: 'true'
      PORT: '3000'
```

### Manual Installation

```bash
# Clone repository
git clone https://github.com/NicholG90/approvarr.git
cd approvarr

# Install dependencies
npm install

# Build project
npm run build

# Configure environment variables
cp .env.example .env
# Edit .env with your settings

# Start the bot
npm start
```

---

## 📋 Requirements

### Discord Setup
- Discord Bot Token ([Create Bot](https://discord.com/developers/applications))
- Discord Server (with admin permissions)
- Channel IDs for notifications

### Overseerr/Jellyseerr
- Running Overseerr or Jellyseerr instance
- API key with appropriate permissions
- Webhook configuration (optional but recommended)

### System Requirements
- **Docker**: Any system supporting Docker
- **Manual**: Node.js 22+ and npm

---

## 📖 Documentation

📚 **[Complete Documentation](https://nicholg90.github.io/approvarr/)**

| Guide | Description |
|-------|-------------|
| 🔧 [Installation](docs/Installation.md) | Step-by-step setup instructions |
| ⚙️ [Configuration](docs/configuration.md) | Environment variables and settings |
| 🎮 [Commands](docs/commands.md) | All available slash commands |
| 🧪 [Testing](docs/testing.md) | Development and testing info |

---

## 🛠️ Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/request_movie` | Request a movie | `/request_movie Inception` |
| `/request_tv` | Request a TV series | `/request_tv Breaking Bad` |
| `/report_issue` | Report media issues | `/report_issue The Office` |
| `/quota_status` | Check request quotas | `/quota_status` |

---

## 🤝 Community & Support

- 💬 **[Discord Server](https://discord.gg/MPwvd9re)** - Get help and chat with users
- 🐛 **[GitHub Issues](https://github.com/nicholg90/approvarr/issues)** - Bug reports and feature requests
- 📖 **[Documentation](https://nicholg90.github.io/approvarr/)** - Complete setup and usage guides

---

## 🔄 Development

```bash
# Development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- Built for the [Overseerr](https://overseerr.dev/) and [Jellyseerr](https://github.com/Fallenbagel/jellyseerr) communities
- Powered by [Discord.js](https://discord.js.org/)
- Inspired by the need for seamless media management workflows

---

<div align="center">

**⭐ If you find Approvarr useful, please give it a star on GitHub! ⭐**

Made with ❤️ for the media management community

</div>
