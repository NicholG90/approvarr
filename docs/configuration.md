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

---

## 🎯 Channel Configuration

### Single Channel Setup
Use one channel for all notifications:
```yaml
environment:
  CHANNEL_ID: "123456789012345678"
  # Don't set REQUEST_CHANNEL_ID or ISSUE_CHANNEL_ID
```

### Multi-Channel Setup
Separate channels for different notification types:
```yaml
environment:
  CHANNEL_ID: "123456789012345678"      # Fallback/general channel
  REQUEST_CHANNEL_ID: "123456789012345679"  # Media requests only
  ISSUE_CHANNEL_ID: "123456789012345680"    # Issue reports only
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

### Automatic Linking
If users sign into Overseerr using Discord OAuth, they're automatically linked.

### Manual Linking  
1. **Get Discord User ID**
   - Enable Developer Mode in Discord
   - Right-click user → Copy User ID

2. **Link in Overseerr**
   ```
   Users → [Select User] → Edit → Discord User ID: [paste ID]
   ```

### Checking Links
Users can verify their linking by running:
```
/quota_status
```

---

## 📊 Quota Configuration

Quotas are configured in Overseerr/Jellyseerr, not in Approvarr.

### Setting Up Quotas

1. **Global Quotas**
   ```
   Overseerr → Settings → General → Request Limits
   ```

2. **User-Specific Quotas**
   ```
   Overseerr → Users → [Select User] → Edit → Quota Settings
   ```

### Quota Types
- **Movie Quota**: Requests per time period
- **TV Quota**: TV series requests per time period  
- **Time Period**: Usually 7 days (configurable)

**Example Configuration:**
```
Movies: 10 requests per 7 days
TV Shows: 5 requests per 7 days
```

---

## 🌐 Network Configuration

### Docker Networking

**Internal Communication:**
```yaml
services:
  approvarr:
    # ... other config
    networks:
      - media_network
  
  overseerr:
    # ... overseerr config  
    networks:
      - media_network

networks:
  media_network:
```

**External Access:**
```yaml
services:
  approvarr:
    ports:
      - "6000:3000"  # External:Internal
```

### Firewall Rules

If using webhooks, ensure these ports are accessible:

| Port | Purpose | Direction |
|------|---------|-----------|
| `6000` | Webhook endpoint | Inbound |
| `5055` | Overseerr API | Outbound |
| `443/80` | Discord API | Outbound |

---

## 🎨 Customization Options

### Custom Channel Names

Use meaningful channel names for better organization:
```
#media-requests    ← REQUEST_CHANNEL_ID
#media-issues      ← ISSUE_CHANNEL_ID  
#bot-notifications ← CHANNEL_ID (fallback)
```

### Notification Filtering

Control which notifications appear by configuring webhooks selectively:

**Minimal Setup** (essentials only):
- ✅ Media Requested
- ✅ Media Approved
- ✅ Media Declined

**Full Setup** (all notifications):
- ✅ All notification types enabled

---

## 🔧 Advanced Configuration

### Environment File Example

Create a `.env` file for manual installations:

```bash
# === REQUIRED ===
BOT_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4.GhI_jK.LmNoPqRstuVwXyZ
CHANNEL_ID=123456789012345678
SERVER_ID=123456789012345678  
OVERSEERR_URL=http://localhost:5055
OVERSEERR_API_KEY=abc123def456ghi789

# === OPTIONAL ===
REQUEST_CHANNEL_ID=123456789012345679
ISSUE_CHANNEL_ID=123456789012345680
ENABLE_SLASH_COMMANDS=true
PORT=3000
```

### Docker Compose Advanced Example

```yaml
services:
  approvarr:
    container_name: approvarr
    image: ghcr.io/nicholg90/approvarr:latest
    restart: unless-stopped
    
    # Network configuration
    networks:
      - media_network
    ports:
      - "6000:3000"
    
    # Environment variables
    environment:
      BOT_TOKEN: "${BOT_TOKEN}"
      CHANNEL_ID: "${CHANNEL_ID}"
      SERVER_ID: "${SERVER_ID}"
      OVERSEERR_URL: "http://overseerr:5055"
      OVERSEERR_API_KEY: "${OVERSEERR_API_KEY}"
      REQUEST_CHANNEL_ID: "${REQUEST_CHANNEL_ID}"
      ISSUE_CHANNEL_ID: "${ISSUE_CHANNEL_ID}"
    
    # Health check
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    
    # Logging
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  media_network:
    external: true
```

---

## ✅ Configuration Validation

### Testing Your Setup

1. **Bot Status Check**
   ```bash
   # Check if bot is online in Discord
   # Verify no errors in logs
   ```

2. **Command Test**
   ```
   /quota_status
   ```
   Should return quota information or permission error.

3. **Request Test** 
   ```
   /request_movie test
   ```
   Should show search results or permission error.

4. **Webhook Test**
   - Make a request in Overseerr
   - Check if notification appears in Discord

### Common Configuration Issues

| Problem | Solution |
|---------|----------|
| Bot offline | Check `BOT_TOKEN` |
| Commands not working | Verify `ENABLE_SLASH_COMMANDS=true` |
| No webhook notifications | Check `PORT` and firewall rules |
| Permission errors | Verify user linking in Overseerr |
| API errors | Check `OVERSEERR_URL` and `OVERSEERR_API_KEY` |

---

## 🔄 Configuration Updates

### Changing Settings

**Docker Compose:**
1. Edit `docker-compose.yml`
2. Run `docker-compose up -d` (auto-restarts with new config)

**Docker Run:**
1. Stop container: `docker stop approvarr`
2. Remove container: `docker rm approvarr`  
3. Run with new environment variables

**Manual Installation:**
1. Edit `.env` file
2. Restart: `npm start`

### No-Downtime Updates

For production environments, consider:
- Using environment variable files
- Blue-green deployment strategies
- Health checks and monitoring

---

## 📚 Next Steps

Once configured:

1. **📘 [Usage Guide](usage.md)** - Learn how to use all features
2. **🎮 [Commands Reference](commands.md)** - All available commands
3. **🧪 [Testing Guide](testing.md)** - Verify everything works
4. **❓ [FAQ](faq.md)** - Common questions and solutions