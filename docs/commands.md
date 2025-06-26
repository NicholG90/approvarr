# 🎮 Commands Reference

Complete guide to all Approvarr Discord slash commands and administrative actions.

---

## 🎬 User Commands

These commands are available to all users (with proper permissions):

### `/request_movie <title>`

Request a movie by searching for its title.

**Usage:**
```
/request_movie Inception
/request_movie The Dark Knight
/request_movie Avengers: Endgame
```

**Process:**
1. 🔍 **Search** - Approvarr searches Overseerr for matches
2. 📋 **Select** - Choose the correct movie from results
3. ✅ **Confirm** - Submit your request
4. 📬 **Notification** - Admins receive request in Discord

**Requirements:**
- `REQUEST` permission in Overseerr
- Available quota (if quotas enabled)
- Discord account linked to Overseerr

---

### `/request_tv <title>`

Request a TV series with season selection options.

**Usage:**
```
/request_tv Breaking Bad
/request_tv The Office
/request_tv Game of Thrones
```

**Process:**
1. 🔍 **Search** - Find the TV series
2. 📋 **Select Series** - Choose correct match
3. 📺 **Pick Seasons** - Select specific seasons or "All Seasons"
4. ✅ **Submit** - Send request to admins

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

**Usage:**
```
/report_issue The Office
/report_issue Breaking Bad
/report_issue Inception
```

**Issue Types:**
- 🎵 **Audio** - Sound problems, wrong language, no audio
- 📝 **Subtitles** - Missing, incorrect, or broken subtitles  
- 🎥 **Video** - Quality issues, corruption, wrong aspect ratio
- ❓ **Other** - Any other problems not covered above

**TV Show Specific:**
- 📺 **Season Selection** - Pick which season has issues
- 📝 **Episode Selection** - Choose specific episode or "Entire Season"
- 📋 **Detailed Form** - Describe the exact problem

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

**Information Displayed:**
- 🎬 **Movie Quota** - Used/limit for movies
- 📺 **TV Quota** - Used/limit for TV shows
- ⏰ **Time Period** - Quota reset timeframe
- 📊 **Remaining** - How many requests you have left

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

## 🔧 Command Behavior

### Permission Handling

**Insufficient Permissions:**
```
❌ You do not have permission to request movies.
❌ You do not have permission to view quota status.
❌ Your Discord ID is not linked to an Overseerr account.
```

**Quota Exceeded:**
```
❌ Quota exceeded! You've used 10/10 movie requests in the last 7 days.
```

### Error Handling

**No Search Results:**
```
No results found for "invalid movie title"
```

**API Errors:**
```
An error occurred while processing your request. Please try again.
```

**Already Exists:**
- Movies/TV shows already available show disabled "Media Exists" button
- Pending requests show disabled "Request Exists" button

---

## 🎯 Usage Examples

### Basic Movie Request
```
User: /request_movie The Matrix
Bot: [Shows search results with buttons]
User: [Clicks "The Matrix (1999)"]
Bot: [Shows request button]
User: [Clicks "Request"]
Bot: ✅ Request submitted successfully!
Admin: [Sees notification in Discord with Approve/Decline buttons]
```

### TV Show with Season Selection
```
User: /request_tv Friends
Bot: [Shows search results]
User: [Selects "Friends (1994)"]
Bot: [Shows season selection: All Seasons, Season 1, Season 2, etc.]
User: [Selects "Season 1", "Season 2"]
Bot: [Shows request button]
User: [Clicks "Request"]
Bot: ✅ Request submitted! Requested Seasons: Season 1, Season 2
```

### Issue Reporting Flow
```
User: /report_issue The Office
Bot: [Shows available media]
User: [Selects "The Office (US)"]
Bot: [Shows season selection]
User: [Selects "Season 2"]
Bot: [Shows episode selection]
User: [Selects "Episode 5"]
Bot: [Shows issue type selection]
User: [Selects "Audio"]
Bot: [Opens issue description form]
User: [Submits: "Audio is out of sync with video"]
Bot: ✅ Issue reported successfully!
Admin: [Sees issue notification with comment/close buttons]
```

---

## ⚙️ Configuration Impact

### Disabled Commands

If `ENABLE_SLASH_COMMANDS=false`:
- All slash commands will be unavailable
- Only webhook notifications and admin buttons work
- Users cannot make requests through Discord

### Channel Routing

Commands respect channel configuration:
- **Requests** → `REQUEST_CHANNEL_ID` (or `CHANNEL_ID`)
- **Issues** → `ISSUE_CHANNEL_ID` (or `CHANNEL_ID`)
- **Errors** → Always private (ephemeral responses)

### Quota Integration

All request commands check quotas automatically:
- Real-time quota validation before requests
- Updated quota display after successful requests
- Clear error messages when quotas exceeded

---

## 📱 Mobile Usage

All commands work perfectly on Discord mobile:
- ✅ **Slash Commands** - Full autocomplete support
- ✅ **Button Interactions** - One-tap approve/decline
- ✅ **Select Menus** - Easy season/episode picking
- ✅ **Modal Forms** - Full-screen issue reporting

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

## 📚 Related Documentation

- **🔧 [Installation](Installation.md)** - Setting up slash commands
- **⚙️ [Configuration](configuration.md)** - Permission and quota setup
- **📘 [Usage Guide](usage.md)** - Detailed workflow examples
- **❓ [FAQ](faq.md)** - Common questions about commands