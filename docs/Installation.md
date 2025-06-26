# Installation

## Docker (Recommended)

#### Docker Compose
```yaml
approvarr:
  container_name: approvarr
  image: ghcr.io/nicholg90/approvarr:production
  environment:
    - BOT_TOKEN=discord_bot_token
    - CHANNEL_ID=discord_channel_id
    - REQUEST_CHANNEL_ID=discord_channel_id # ## Optional -- See Configuration
    - ISSUE_CHANNEL_ID=discord_channel_id # ## Optional - See Configuration
    - SERVER_ID=discord_server_id
    - PORT=3000
    - OVERSEERR_URL=overseerr/jellyseerr_url
    - OVERSEERR_API_KEY=overseerr/jellyseerr_api_key
    - ENABLE_SLASH_COMMANDS=true
  ports:
    - 6000:3000
```

#### Docker Run

```bash
docker run --name approvarr -p 6000:3000 -e BOT_TOKEN=discord_bot_token -e CHANNEL_ID=discord_channel_id -e REQUEST_CHANNEL_ID=discord_channel_id -e ISSUE_CHANNEL_ID=discord_channel_id -e SERVER_ID=discord_server_id -e PORT=3000 -e OVERSEERR_URL=overseerr/jellyseerr_url -e OVERSEERR_API_KEY=overseerr/jellyseerr_api_key -e ENABLE_SLASH_COMMANDS=true ghcr.io/nicholg90/approvarr:production
```

## Manual Setup

#### Requirements

- Node 20 or later

1. Close the repository

    ```bash
    git clone https://github.com/NicholG90/approvarr.git && cd approvarr
    ```

2. Install Dependencies

    ```bash
    npm install
    ```

3. Compile Typescript

    ```bash
    tsc
    ```

4. Rename and Complete environment file (.env)
5. Start the service

    ```bash
    npm start run
    ```

Once installed please see the [configuration documentation](https://github.com/NicholG90/approvarr/blob/main/docs/README.md)
