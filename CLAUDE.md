# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Test
- `npm run build` - Compile TypeScript to dist/
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm test` - Run Jest test suite
- `npm run test:coverage` - Run tests with coverage report
- `npm run dev` - Start development server with ts-node

### Test Coverage
Run `npm run test:coverage` after changes. The project has comprehensive test coverage across commands, handlers, helpers, and API integration.

## Architecture Overview

**Approvarr** is a Discord bot that bridges Overseerr/Jellyseerr with Discord for media requests and issue management.

### Core Structure
```
src/
├── bot.ts                 # Main entry point
├── commands/overseerr/    # Slash commands (/request_movie, /request_tv, etc.)
├── handlers/              # Modal and select menu handlers
├── listeners/             # Discord event listeners (button, command, etc.)
├── helpers/apis/          # Overseerr API client and utilities
├── interfaces/            # TypeScript type definitions
├── outbound/              # UI builders (embeds, selects, notifications)
└── webhooks/              # Express webhook server for Overseerr
```

### Key Components

- **Discord Integration**: Uses discord.js v14 with slash commands, buttons, select menus, and modals
- **API Client**: Centralized Overseerr/Jellyseerr API client with authentication and user impersonation
- **Webhook System**: Express server receives real-time notifications from Overseerr
- **Permission System**: Role-based access control integrated with Discord roles
- **Quota Management**: Built-in request limits per user

### Environment Variables
Required: `BOT_TOKEN`, `CHANNEL_ID`, `SERVER_ID`, `OVERSEERR_URL`, `OVERSEERR_API_KEY`

### Technology Stack
- Node.js 22+, TypeScript, Discord.js v14, Express, Axios
- Testing: Jest with comprehensive mocks for Discord interactions
- Linting: ESLint with @antfu/eslint-config

### API Integration Patterns
- All Overseerr API calls go through `src/helpers/apis/overseerr/overseerrApi.ts`
- User impersonation for request submissions
- Consistent error handling across API calls

### UI Component Patterns
- Embeds built in `src/outbound/` directory
- Select menus and buttons preserve existing components when updating messages
- Modal forms for multi-step workflows (TV season/episode selection, issue reporting)

### Error Handling
- Permission checks return structured responses
- API errors are caught and converted to user-friendly Discord messages
- All handlers include comprehensive error handling with logging
