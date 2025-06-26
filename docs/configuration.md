# Configuration

## Discord Configuration

To use approvarr you will need to gather a number of details from your discord server and add the bot.

Create a new application(https://discord.com/developers/applications) for your discord server

## approvarr Configuarion

### Optional Settings

The below are optional variabless you can set to customize your approvarr installation.

| Environment Variable (Docker)  | Type    | Default Value | Description
| ------------------------------ | ------- | ------------- | ---------- |
| `REQUEST_CHANNEL_ID` | string | N/A | Sets the channel that requests will be sent to - if not set requests will be sent to the default `CHANNEL_ID`||
| `ISSUE_CHANNEL_ID`| string | N/A | Sets the channel that issues will be sent to - if not set issues will be sent to the default `CHANNEL_ID`|
| `ENABLE_SLASH_COMMANDS`| boolean  | true  | Enables or Disables Slash Commands |
