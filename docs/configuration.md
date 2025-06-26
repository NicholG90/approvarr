# ⚙️ Configuration Guide

This guide covers all configuration options for Approvarr, including environment variables, permissions, and advanced settings.

---

## 🔧 Environment Variables

### Required Settings

These settings are **mandatory** for Approvarr to function:

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `BOT_TOKEN` | string | Discord bot token | `MTIzNDU2Nzg5MDEyMzQ1Njc4.GhI_jK.LmNoPqRstuVwXyZ` |
| `CHANNEL_ID` | string | Default Discord channel ID | `123456789012345678` |
| `SERVER_ID` | string | Discord server (guild) ID | `123456789012345678` |
| `OVERSEERR_URL` | string | Overseerr/Jellyseerr base URL | `http://overseerr:5055` |
| `OVERSEERR_API_KEY` | string | Overseerr/Jellyseerr API key | `abc123def456ghi789` |

### Optional Settings

These settings allow you to customize Approvarr's behavior:

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REQUEST_CHANNEL_ID` | string | `CHANNEL_ID` | Separate channel for media requests |
| `ISSUE_CHANNEL_ID` | string | `CHANNEL_ID` | Separate channel for issue reports |
| `ENABLE_SLASH_COMMANDS` | boolean | `true` | Enable Discord slash commands |
| `PORT` | number | `3000` | Port for webhook server |
| `ENABLE_QUOTA_CHECK` | boolean | `true` | Enables Quota Check Slash Command |

---

## 🎯 Channel Configuration

### Single Channel Setup
Use one channel for all notifications:
```yaml
environment:
  CHANNEL_ID: '123456789012345678'
  # Don't set REQUEST_CHANNEL_ID or ISSUE_CHANNEL_ID
```

### Multi-Channel Setup
Separate channels for different notification types:
```yaml
environment:
  CHANNEL_ID: '123456789012345678' # Fallback/general channel
  REQUEST_CHANNEL_ID: '123456789012345679' # Media requests only
  ISSUE_CHANNEL_ID: '123456789012345680' # Issue reports only
```

**Recommendations:**
- **Single Channel**: Good for small servers or testing
- **Multi-Channel**: Better for larger servers to organize notifications

---

## 🔐 Discord Bot Configuration

### Required Permissions

Your Discord bot needs these permissions:

| Permission | Reason |
|------------|--------|
| **Send Messages** | Post notifications and responses |
| **Use Slash Commands** | Enable `/request_movie`, `/request_tv`, etc. |
| **Embed Links** | Create rich media embeds |
| **Read Message History** | Update existing messages |
| **Add Reactions** | Add emoji reactions to messages |
| **Manage Messages** | Edit/update notification messages |

### Bot Setup Steps

1. **Create Application**
   ```
   Discord Developer Portal → New Application → [Your Bot Name]
   ```

2. **Configure Bot**
   ```
   Bot Section → Add Bot → Copy Token
   ```

3. **Set Permissions**
   ```
   OAuth2 → URL Generator → bot + applications.commands
   Select permissions above → Copy URL → Invite bot
   ```

---

## 🎛️ Overseerr/Jellyseerr Configuration

### API Key Setup

1. **Log into Overseerr/Jellyseerr**
2. **Navigate to Settings**
   ```
   Settings → General → API Key
   ```
3. **Copy API Key**
   - Use this value for `OVERSEERR_API_KEY`

### User Permissions

Approvarr uses Overseerr's built-in permission system. Users need these Overseerr permissions:

| Action | Required Permission |
|--------|-------------------|
| Request media | `REQUEST` |
| View quota status | `REQUEST` |
| Report issues | `REQUEST` (typically) |
| Approve/decline requests | `MANAGE_REQUESTS` |
| Manage issues | `MANAGE_ISSUES` |

### Webhook Configuration (Recommended)

Enable real-time notifications by setting up webhooks:

1. **In Overseerr/Jellyseerr:**
   ```
   Settings → Notifications → Webhook
   ```

2. **Add Webhook URL:**
   ```
   http://your-server-ip:6000/webhook
   ```
   Replace `your-server-ip` with your actual server IP/domain.

3. **Select Notification Types:**
   - ✅ Media Requested
   - ✅ Media Approved
   - ✅ Media Declined
   - ✅ Media Available
   - ✅ Issue Created
   - ✅ Issue Comment
   - ✅ Issue Resolved

---

## 🔗 User Linking

For Approvarr to work properly, Discord users must be linked to Overseerr accounts:

### Manual Linking
1. **Get Discord User ID**
   - Enable Developer Mode in Discord
   - Right-click user → Copy User ID

2. **Link in Overseerr**
   ```
   Users → [Select User] → Edit → Discord User ID: [paste ID]
   ```
