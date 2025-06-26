# 🎮 Commands Reference

Complete guide to all Approvarr Discord slash commands and administrative actions.

---

## 🎬 User Commands

These commands are available to all users (with proper permissions):

### `/request_movie <title>`

Request a movie by searching for its title.

**Requirements:**
- `REQUEST` permission in Overseerr
- Available quota (if quotas enabled)
- Discord account linked to Overseerr

---

### `/request_tv <title>`

Request a TV series with season selection options.

**Season Options:**
- **All Seasons** - Request every available season
- **Specific Seasons** - Select individual seasons (Season 1, Season 2, etc.)
- **Multiple Seasons** - Choose multiple specific seasons

**Requirements:**
- `REQUEST` permission in Overseerr
- Available TV quota (if quotas enabled)
- Discord account linked to Overseerr

---

### `/report_issue <title>`

Report problems with existing media content.

**Issue Types:**
- 🎵 **Audio** - Sound problems, wrong language, no audio
- 📝 **Subtitles** - Missing, incorrect, or broken subtitles
- 🎥 **Video** - Quality issues, corruption, wrong aspect ratio
- ❓ **Other** - Any other problems not covered above

**Requirements:**
- Media must already exist in Overseerr
- Discord account linked to Overseerr
- Access to issue reporting (usually `REQUEST` permission)

---

### `/quota_status`

Check your current request quotas and usage.

**Usage:**
```
/quota_status
```

**Example Output:**
```
📊 Quota Status: 3/10 movie requests used in the last 7 days (7 remaining)
📊 Quota Status: 1/5 tv requests used in the last 7 days (4 remaining)
```

**Requirements:**
- `REQUEST` permission in Overseerr
- Discord account linked to Overseerr

---

## 🛡️ Administrative Actions

These actions are available to users with administrative permissions:

### Request Management

**Approve Request** ✅
- Click the **Approve** button on request notifications
- Requires `MANAGE_REQUESTS` permission in Overseerr
- Request will be added to Overseerr queue

**Decline Request** ❌
- Click the **Decline** button on request notifications
- Requires `MANAGE_REQUESTS` permission in Overseerr
- User will be notified of the decision

### Issue Management

**Add Comment** 💬
- Click **Add Comment** button on issue notifications
- Opens a form to write detailed responses
- Requires `MANAGE_ISSUES` permission in Overseerr
- Comments sync back to Overseerr

**Close Issue** 🔒
- Click **Close Issue** button to mark as resolved
- Requires `MANAGE_ISSUES` permission in Overseerr
- Issue status updates in both Discord and Overseerr

---

## ⚙️ Configuration Impact

### Disabled Commands

If `ENABLE_SLASH_COMMANDS=false`:
- All slash commands will be unavailable
- Only webhook notifications and admin buttons work
- Users cannot make requests through Discord

---

## 🔄 Command Updates

Commands automatically update when:
- Bot restarts with new features
- Discord cache refreshes
- Server permissions change

**Force Command Refresh:**
1. Restart the bot
2. Re-invite bot with updated permissions
3. Wait up to 1 hour for Discord cache refresh

---

## 🆘 Troubleshooting Commands

| Problem | Solution |
|---------|----------|
| Commands not appearing | Check `ENABLE_SLASH_COMMANDS=true` |
| Permission errors | Verify Overseerr user linking |
| No search results | Check Overseerr API connectivity |
| Buttons not working | Verify bot has "Manage Messages" permission |
| Forms not opening | Ensure bot has "Use Slash Commands" permission |

---
