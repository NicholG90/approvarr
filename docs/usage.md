# 📘 Usage Guide

Complete walkthrough of using Approvarr for media requests, issue reporting, and administrative management.

---

## 🎯 Overview

Approvarr transforms your Discord server into a comprehensive media management hub by seamlessly integrating with Overseerr/Jellyseerr. Whether you're a user requesting content or an administrator managing your media library, everything happens directly in Discord.

**What You Can Do:**
- 🎬 **Request Movies & TV Shows** - Simple slash commands with smart search
- 🐛 **Report Media Issues** - Detailed issue tracking with forms
- ⚡ **Instant Management** - Admins can approve/decline with one click
- 📊 **Track Quotas** - Monitor request limits and usage
- 🔄 **Real-time Updates** - Webhook integration keeps everything synced

---

## 👥 For Users

### 🎬 Requesting Movies

**Command:** `/request_movie <title>`

**Step-by-Step Process:**

1. **🔍 Search for Content**
   ```
   /request_movie The Matrix
   ```

2. **📋 Select Correct Match**
   - Bot shows search results with release years
   - Click the button for the correct movie
   - See movie poster, plot, and details

3. **✅ Submit Request**
   - Click "Request" if it's available
   - See "Media Exists" if already downloaded
   - See "Request Exists" if already pending

4. **📬 Get Confirmation**
   ```
   ✅ Request submitted successfully!
   Your request for "The Matrix (1999)" has been sent to the admins.
   ```

**Pro Tips:**
- Include release year for better matches: `The Matrix 1999`
- Use full movie titles to avoid confusion
- Check if the movie already exists before requesting

---

### 📺 Requesting TV Shows

**Command:** `/request_tv <title>`

**Enhanced Process for TV Content:**

1. **🔍 Search for Series**
   ```
   /request_tv Breaking Bad
   ```

2. **📋 Choose Series**
   - Select the correct TV show from results
   - Bot displays series information and seasons

3. **📺 Season Selection**
   - **All Seasons**: Request everything available
   - **Specific Seasons**: Choose individual seasons (Season 1, Season 2, etc.)
   - **Multiple Seasons**: Select several seasons at once

4. **✅ Submit Request**
   ```
   ✅ Request submitted!
   Requested Seasons: Season 1, Season 2, Season 3
   ```

**Season Selection Examples:**
- **Complete Series**: Select "All Seasons" for the entire show
- **Specific Seasons**: Choose "Season 1" and "Season 3" for just those
- **New Seasons**: Request only "Season 5" if previous seasons exist

---

### 🐛 Reporting Issues

**Command:** `/report_issue <title>`

**Comprehensive Issue Reporting:**

1. **🔍 Find Media**
   ```
   /report_issue The Office
   ```

2. **📋 Select Content**
   - Choose the correct series/movie from available options
   - Only shows content that exists in your library

3. **📺 Specify Details (TV Shows)**
   - **Season Selection**: Pick which season has issues
   - **Episode Selection**: Choose specific episode or "Entire Season"

4. **🎭 Issue Type Selection**
   - 🎵 **Audio**: Sound problems, wrong language, missing audio
   - 📝 **Subtitles**: Missing, incorrect, or broken subtitles
   - 🎥 **Video**: Quality issues, corruption, wrong aspect ratio
   - ❓ **Other**: Any problems not covered above

5. **📝 Detailed Description**
   - Form opens for detailed issue description
   - Provide specific information about the problem
   - Submit your report

**Example Issue Report:**
```
Media: The Office (US) - Season 2, Episode 5
Issue Type: Audio
Description: Audio is completely out of sync with video starting around 15 minutes in. The delay gets worse throughout the episode.
```

---

### 📊 Checking Quotas

**Command:** `/quota_status`

**Understanding Your Limits:**

```
📊 Your Request Status:
🎬 Movies: 3/10 requests used in the last 7 days (7 remaining)
📺 TV Shows: 1/5 requests used in the last 7 days (4 remaining)
⏰ Quotas reset in 3 days
```

**Quota Information:**
- **Current Usage**: How many requests you've made
- **Limits**: Maximum requests allowed per time period
- **Remaining**: How many requests you have left
- **Reset Time**: When your quotas refresh

**What Happens When Quotas Are Exceeded:**
```
❌ Quota exceeded!
You've used 10/10 movie requests in the last 7 days.
Your quota resets in 2 days.
```

---

## 🛡️ For Administrators

### ✅ Managing Requests

**Request Notifications Appear Like This:**

```
🎬 New Movie Request
The Matrix (1999)

Requested by: @username
Synopsis: A computer hacker learns from mysterious rebels...

[Approve] [Decline]
```

**Administrative Actions:**

**Approve Request** ✅
- Click "Approve" button
- Request automatically added to Overseerr queue
- User gets confirmation notification
- Status updates in real-time

**Decline Request** ❌
- Click "Decline" button
- User gets notification of decline
- Optional: Add comment explaining why

**One-Click Efficiency:**
- No need to switch to Overseerr interface
- Decisions sync back to Overseerr immediately
- Full audit trail maintained

---

### 🔧 Managing Issues

**Issue Notifications Include:**

```
🐛 New Issue Report
The Office (US) - Season 2, Episode 5
Issue Type: Audio

Report: Audio is out of sync with video starting around 15 minutes in...

Reported by: @username

[Add Comment] [Close Issue]
```

**Administrative Actions:**

**Add Comment** 💬
- Click "Add Comment" to respond
- Form opens for detailed response
- Comments sync to Overseerr issue tracker
- User gets notified of your response

**Close Issue** 🔒
- Click "Close Issue" when resolved
- Issue marked as resolved in both Discord and Overseerr
- User gets resolution notification

**Issue Tracking:**
- Full conversation history maintained
- Multiple admins can collaborate on issues
- Status updates reflected in both platforms

---

## 🔄 Webhook Integration

### Real-Time Updates

When properly configured, webhooks provide instant notifications:

**Request Status Changes:**
```
✅ Request Approved: The Matrix (1999)
Your request has been approved and added to the download queue.
```

**Download Completion:**
```
📥 Now Available: The Matrix (1999)
Your requested movie is now available for streaming!
```

**Issue Updates:**
```
💬 Comment Added to Issue: The Office S2E5
Admin response: We've re-encoded this episode. Please try again.
```

### Webhook Configuration Benefits

- **Instant Feedback**: Users know immediately when requests are processed
- **Status Tracking**: Real-time updates on download progress
- **Administrative Efficiency**: Automatic notification management
- **User Satisfaction**: Transparent communication throughout the process

---

## 📱 Mobile Usage

### Discord Mobile App

All Approvarr features work perfectly on mobile:

**Slash Commands** 📱
- Full autocomplete support
- Easy typing with suggestions
- Touch-friendly interface

**Button Interactions** 🔘
- Large, touch-friendly buttons
- One-tap approve/decline actions
- Instant feedback on actions

**Forms and Modals** 📝
- Full-screen issue reporting forms
- Mobile-optimized text input
- Easy submission process

**Navigation** 🧭
- Embedded links work seamlessly
- Easy switching between channels
- Notification management

---

## 🎯 Workflow Examples

### Complete Movie Request Flow

```
User: /request_movie Inception
Bot: [Shows search results with movie posters]
User: [Clicks "Inception (2010)"]
Bot: [Shows movie details and "Request" button]
User: [Clicks "Request"]
Bot: ✅ Request submitted successfully!

--- Admin Channel ---
Bot: 🎬 New Movie Request: Inception (2010)
     Requested by: @user
     [Approve] [Decline]
Admin: [Clicks "Approve"]
Bot: ✅ Request approved and added to download queue

--- User Gets Update ---
Bot: ✅ Request Approved: Inception (2010)
     Your request has been approved!

--- Later (via webhook) ---
Bot: 📥 Now Available: Inception (2010)
     Your movie is ready to watch!
```

### TV Show Seasonal Request

```
User: /request_tv Game of Thrones
Bot: [Shows search results]
User: [Selects "Game of Thrones (2011)"]
Bot: [Shows season selection menu]
User: [Selects "Season 1", "Season 2", "Season 3"]
Bot: [Shows request confirmation]
User: [Clicks "Request"]
Bot: ✅ Request submitted! Requested Seasons: Season 1, Season 2, Season 3

Admin: [Sees request notification]
Admin: [Clicks "Approve"]
Bot: ✅ Request approved for 3 seasons
```

### Issue Resolution Workflow

```
User: /report_issue The Office
Bot: [Shows available Office series]
User: [Selects "The Office (US)"]
Bot: [Shows season selection]
User: [Selects "Season 2"]
Bot: [Shows episode selection]
User: [Selects "Episode 5"]
Bot: [Shows issue type menu]
User: [Selects "Audio"]
Bot: [Opens description form]
User: [Submits: "Audio sync issues after 15 minutes"]
Bot: ✅ Issue reported successfully!

--- Admin Channel ---
Bot: 🐛 New Issue: The Office S2E5 - Audio
     Report: Audio sync issues after 15 minutes
     [Add Comment] [Close Issue]
Admin: [Clicks "Add Comment"]
Admin: [Submits: "We'll re-encode this episode today"]
Bot: 💬 Comment added to issue

--- User Gets Update ---
Bot: 💬 Admin Response: The Office S2E5
     Comment: We'll re-encode this episode today

--- After Fix ---
Admin: [Clicks "Close Issue"]
Bot: ✅ Issue Resolved: The Office S2E5
User: [Gets resolution notification]
```

---

## ⚙️ Advanced Usage

### Permission-Based Access

**User Permissions** (Overseerr-based):
- `REQUEST`: Can request media and check quotas
- `REQUEST`: Can typically report issues
- No special perms: Can view but not interact

**Admin Permissions** (Overseerr-based):
- `MANAGE_REQUESTS`: Can approve/decline requests
- `MANAGE_ISSUES`: Can comment on and close issues
- Multiple permission levels supported

### Multi-Channel Setup

**Organized Workflow:**
```
#media-requests     ← Movie/TV requests appear here
#media-issues       ← Issue reports appear here
#admin-notifications ← General bot notifications
```

**Benefits:**
- **Cleaner Organization**: Separate content types
- **Focused Attention**: Admins can monitor specific channels
- **Reduced Noise**: Users only see relevant notifications

### Quota Management Strategies

**User Education:**
```
/quota_status  # Check regularly before requesting
```

**Admin Monitoring:**
- Track request patterns
- Adjust quotas based on usage
- Communicate limits clearly to users

---

## 🔧 Troubleshooting Common Issues

### User-Side Problems

| Issue | Solution |
|-------|----------|
| Commands not appearing | Wait for Discord cache refresh (up to 1 hour) |
| "Permission denied" errors | Contact admin to link Discord to Overseerr account |
| No search results | Try different spelling or include release year |
| Buttons not responding | Check Discord app is updated |

### Admin-Side Problems

| Issue | Solution |
|-------|----------|
| Requests not appearing | Check webhook configuration |
| Can't approve/decline | Verify `MANAGE_REQUESTS` permission in Overseerr |
| Issues not syncing | Check API connectivity between services |

---

## 📚 Related Documentation

- **🔧 [Installation Guide](Installation.md)** - Get Approvarr running
- **⚙️ [Configuration Guide](configuration.md)** - Customize settings
- **🎮 [Commands Reference](commands.md)** - All available commands
- **❓ [FAQ](faq.md)** - Common questions and answers

---

## 💡 Tips for Success

### For Users
- **Be Specific**: Include release years in searches
- **Check First**: Use `/quota_status` before requesting
- **Provide Details**: Give thorough issue descriptions
- **Be Patient**: Downloads take time after approval

### For Administrators
- **Stay Responsive**: Quick approvals improve user experience
- **Communicate**: Use comments to explain decisions
- **Monitor Quotas**: Adjust limits based on server capacity
- **Set Expectations**: Document your approval criteria

---

**Ready to start using Approvarr? Begin with `/request_movie` or `/request_tv` and experience seamless media management! 🎬**
