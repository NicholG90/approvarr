# ❓ Frequently Asked Questions

Quick answers to common questions about Approvarr setup, usage, and troubleshooting.

---

## 🎯 General Questions

### What is Approvarr?

Approvarr is a powerful Discord bot that seamlessly integrates with Overseerr/Jellyseerr to bring media request and issue management directly into your Discord server. Instead of switching between multiple applications, users can request movies/TV shows, report issues, and administrators can approve/decline requests all from Discord.

### How is Approvarr different from other media bots?

**Key Differentiators:**
- 🔄 **Two-way Integration**: Full sync between Discord and Overseerr/Jellyseerr
- ⚡ **Real-time Management**: Instant approve/decline with Discord buttons
- 📊 **Built-in Quotas**: Native request limit management
- 🐛 **Issue Tracking**: Comprehensive media problem reporting
- 🎯 **Permission-aware**: Uses your existing Overseerr user management

### Do I need both Overseerr AND Jellyseerr?

No! Approvarr works with **either** Overseerr **or** Jellyseerr. You only need one:
- **Overseerr**: For Plex media servers
- **Jellyseerr**: For Jellyfin media servers

### Is Approvarr free?

Yes! Approvarr is completely free and open-source under the MIT license. No premium features, no subscriptions, no limitations.

---

## 🔧 Installation & Setup

### How do I install Approvarr?

**Recommended Method - Docker:**
```yaml
# docker-compose.yml
services:
  approvarr:
    image: ghcr.io/nicholg90/approvarr:latest
    ports:
      - "6000:3000"
    environment:
      BOT_TOKEN: "your_bot_token"
      CHANNEL_ID: "your_channel_id"
      # ... other settings
```

See the complete [Installation Guide](Installation.md) for detailed steps.

### What Discord permissions does the bot need?

**Required Discord Bot Permissions:**
- Send Messages
- Use Slash Commands
- Embed Links
- Read Message History
- Add Reactions
- Manage Messages

Generate the invite URL in Discord Developer Portal with these permissions selected.

### How do I get my Discord bot token?

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application → [Your Bot Name]
3. Go to "Bot" section → "Add Bot"
4. Click "Copy" under Token
5. **⚠️ Never share this token publicly!**

### How do I find Discord IDs?

**Enable Developer Mode:**
1. Discord Settings → Advanced → Developer Mode (ON)

**Get IDs:**
- **Server ID**: Right-click server name → Copy Server ID
- **Channel ID**: Right-click channel → Copy Channel ID
- **User ID**: Right-click username → Copy User ID

### Where do I get the Overseerr API key?

1. Log into your Overseerr/Jellyseerr instance
2. Go to Settings → General → API Key
3. Copy the API key shown
4. Use this for `OVERSEERR_API_KEY` environment variable

---

## 🎮 Usage Questions

### How do users request movies and TV shows?

**Simple Commands:**
```
/request_movie The Matrix
/request_tv Breaking Bad
```

**Process:**
1. User types command with title
2. Bot shows search results with posters
3. User selects correct match
4. User clicks "Request" button
5. Admin receives notification in Discord
6. Admin approves/declines with buttons

See the [Usage Guide](usage.md) for detailed workflows.

### Can I request specific seasons of a TV show?

Yes! TV requests include flexible season selection:
- **All Seasons**: Request everything available
- **Specific Seasons**: Choose Season 1, Season 3, etc.
- **Multiple Seasons**: Select several at once
- **Individual Seasons**: Request just new seasons

### How do quotas work?

**Quota System:**
- Configured in Overseerr/Jellyseerr (not Approvarr)
- Typically set per time period (e.g., 10 movies per 7 days)
- Enforced automatically when users make requests
- Users can check status with `/quota_status`

**Example:**
```
📊 Your Request Status:
🎬 Movies: 3/10 requests used (7 remaining)
📺 TV Shows: 1/5 requests used (4 remaining)
```

### How do I report issues with media?

**Issue Reporting Process:**
```
/report_issue The Office
```

1. **Select Media**: Choose from available content
2. **Specify Details**: Season/episode for TV shows
3. **Issue Type**: Audio, Video, Subtitles, or Other
4. **Description**: Detailed problem description
5. **Submit**: Report goes to admins

### Can I use Approvarr on mobile?

Absolutely! All features work perfectly on Discord mobile:
- ✅ Slash commands with autocomplete
- ✅ Touch-friendly buttons
- ✅ Mobile-optimized forms
- ✅ Real-time notifications

---

## 🛡️ Administrative Questions

### How do I approve or decline requests?

**One-Click Management:**
1. Request notifications appear in your configured Discord channel
2. Click **[Approve]** or **[Decline]** buttons
3. Decision syncs automatically to Overseerr/Jellyseerr
4. User gets instant notification

**No Need To:**
- Switch to Overseerr interface
- Manually update request status
- Search for the request

### How do I manage issue reports?

**Issue Management:**
- **Add Comment**: Click button → Type response → Submit
- **Close Issue**: Click button when problem is resolved
- **Track Progress**: Full conversation history maintained

Comments sync between Discord and Overseerr/Jellyseerr.

### Can I have separate channels for requests and issues?

Yes! Multi-channel setup is supported:

```yaml
environment:
  CHANNEL_ID: "123456"           # Fallback channel
  REQUEST_CHANNEL_ID: "123457"   # Movie/TV requests
  ISSUE_CHANNEL_ID: "123458"     # Issue reports
```

**Benefits:**
- Organized workflow
- Focused admin attention
- Reduced notification noise

### What permissions do users need?

**User Permissions (from Overseerr):**
- `REQUEST`: Can request media and check quotas
- `REQUEST`: Can typically report issues
- `MANAGE_REQUESTS`: Can approve/decline (admins)
- `MANAGE_ISSUES`: Can manage issues (admins)

Users must be linked between Discord and Overseerr accounts.

---

## 🔧 Technical Questions

### Do I need webhooks configured?

**Webhooks are optional but highly recommended:**

**Without Webhooks:** ❌
- No real-time status updates
- Users don't know when requests are processed
- Manual notification management

**With Webhooks:** ✅
- Instant notifications for request status changes
- "Now Available" messages when downloads complete
- Automatic issue status updates
- Better user experience

### How do I set up webhooks?

**In Overseerr/Jellyseerr:**
1. Settings → Notifications → Webhook
2. Add webhook URL: `http://your-server:6000/webhook`
3. Enable notification types:
   - Media Requested ✅
   - Media Approved ✅  
   - Media Declined ✅
   - Media Available ✅
   - Issue Created ✅
   - Issue Comment ✅

### What ports does Approvarr use?

**Default Ports:**
- **Internal**: Port 3000 (inside Docker container)
- **External**: Port 6000 (exposed to host system)
- **Configurable**: Change with `PORT` environment variable

**Firewall Requirements:**
- Port 6000 (or your chosen port) open for webhooks
- Outbound access to Discord API (ports 80/443)
- Access to Overseerr API (typically port 5055)

### Can I run Approvarr without Docker?

Yes! Manual installation is supported:

**Requirements:**
- Node.js 22+ and npm
- Git for cloning repository

**Process:**
```bash
git clone https://github.com/NicholG90/approvarr.git
cd approvarr
npm install
npm run build
npm start
```

See [Installation Guide](Installation.md) for complete manual setup.

---

## 🐛 Troubleshooting

### The bot appears offline in Discord

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Invalid bot token | Double-check `BOT_TOKEN` environment variable |
| Network connectivity | Verify internet access from bot server |
| Discord API issues | Check Discord status page |
| Bot not invited properly | Re-invite with correct permissions |

### Slash commands aren't appearing

**Troubleshooting Steps:**
1. **Check Configuration**: Ensure `ENABLE_SLASH_COMMANDS=true`
2. **Verify Permissions**: Bot needs "applications.commands" permission
3. **Wait for Sync**: Discord can take up to 1 hour to refresh commands
4. **Restart Bot**: Try restarting the Approvarr container/process

### Users get "permission denied" errors

**Common Issues:**

| Error | Solution |
|-------|----------|
| Discord not linked to Overseerr | Link Discord ID in Overseerr user settings |
| Missing Overseerr permissions | Grant `REQUEST` permission in Overseerr |
| User not found | Create user account in Overseerr first |

**Linking Process:**
1. Get Discord User ID (right-click → Copy User ID)
2. In Overseerr: Users → [Select User] → Edit → Discord User ID

### Webhooks aren't working

**Diagnostic Steps:**

1. **Test Bot Endpoint:**
   ```bash
   curl http://your-server:6000/webhook
   ```

2. **Check Overseerr Configuration:**
   - Webhook URL correct: `http://your-server:6000/webhook`
   - Notification types enabled
   - Test webhook in Overseerr settings

3. **Verify Network Access:**
   - Overseerr can reach bot server
   - Firewall allows inbound connections
   - Port forwarding configured correctly

### API connection errors

**Common Issues:**

| Error | Solution |
|-------|----------|
| Connection refused | Check `OVERSEERR_URL` is correct and accessible |
| Authentication failed | Verify `OVERSEERR_API_KEY` is valid |
| Timeout errors | Check network connectivity and firewall rules |
| SSL/TLS errors | Use `http://` for local connections, `https://` for remote |

### Requests/issues not syncing

**Troubleshooting:**
1. **Check API Connectivity**: Test API key and URL
2. **Verify Permissions**: Admin user has `MANAGE_REQUESTS`/`MANAGE_ISSUES`
3. **Review Logs**: Check bot logs for error messages
4. **Test Manual Actions**: Try actions directly in Overseerr

---

## 🔄 Updates & Maintenance

### How do I update Approvarr?

**Docker Users:**
```bash
docker-compose pull
docker-compose up -d
```

**Manual Installation:**
```bash
git pull origin main
npm install
npm run build
npm start
```

### How do I back up my configuration?

**Docker Compose:**
- Back up your `docker-compose.yml` file
- Back up any `.env` files

**Manual Installation:**
- Back up your `.env` file
- Back up any custom configuration

### Do I need to restart after configuration changes?

**Yes, restart required for:**
- Environment variable changes
- Docker configuration updates
- API key changes

**Docker Restart:**
```bash
docker-compose restart approvarr
```

---

## 📞 Getting Help

### Where can I get support?

**Support Channels:**
- 💬 **[Discord Server](https://discord.gg/MPwvd9re)** - Live community support
- 🐛 **[GitHub Issues](https://github.com/nicholg90/approvarr/issues)** - Bug reports and feature requests
- 📖 **[Documentation](https://nicholg90.github.io/approvarr/)** - Complete guides and references

### How do I report bugs?

**Before Reporting:**
1. Check [existing issues](https://github.com/nicholg90/approvarr/issues)
2. Try the latest version
3. Check logs for error messages

**Bug Report Should Include:**
- Approvarr version
- Docker/manual installation method
- Error messages/logs
- Steps to reproduce
- Expected vs actual behavior

### Can I contribute to Approvarr?

Absolutely! Contributions are welcome:
- 🐛 **Bug Fixes**: Fix issues and improve stability
- ✨ **Features**: Add new functionality
- 📖 **Documentation**: Improve guides and help
- 🧪 **Testing**: Help test new versions

See the [Contributing Guide](contributing.md) for details.

---

## 💡 Tips & Best Practices

### For Users
- **Include Release Years**: "The Matrix 1999" for better search results
- **Check Quotas First**: Use `/quota_status` before requesting
- **Be Specific**: Detailed issue descriptions help admins resolve problems faster
- **Be Patient**: Downloads take time after approval

### For Administrators
- **Respond Quickly**: Fast approvals improve user experience
- **Use Comments**: Explain declined requests to educate users
- **Monitor Usage**: Track request patterns and adjust quotas
- **Set Expectations**: Document your approval criteria

### For Setup
- **Use Docker**: More reliable than manual installation
- **Enable Webhooks**: Essential for good user experience
- **Separate Channels**: Organize requests and issues separately
- **Test Everything**: Verify all features work before going live

---

**Still have questions? Join our [Discord community](https://discord.gg/MPwvd9re) for real-time help! 💬**