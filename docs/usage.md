# Usage

## Overview

Approvarr is a Discord bot that integrates with Overseerr/Jellyseerr to manage media requests and issues directly from Discord. It allows users to request movies/TV, report issues, and allows admins to approve/decline requests and manage issues—all from Discord.

## Slash Commands

- `/request_movie` — Request a movie by title.
- `/request_tv` — Request a TV show by title.
- `/report_issue` — Report an issue with a media item.
- `/quota_status` — Check your current request quota (if enabled).

## Requesting Media

1. Use `/request_movie` or `/request_tv` and enter the title.
2. Select the correct result from the list.
3. Confirm your request.

## Reporting Issues

1. Use `/report_issue` and enter the title of the media.
2. Select the correct result.
3. Fill out the issue form and submit.

## Approving/Declining Requests (Admins)

- Admins will see request/issue notifications in the configured Discord channel.
- Use the provided buttons to approve, decline, or comment on requests/issues.

## Webhooks

Approvarr can receive webhooks from Overseerr/Jellyseerr to update request/issue status in Discord.

## Permissions

- Only users with the correct Discord roles can approve/decline requests or manage issues (see configuration).

## More

See [Configuration](configuration.md) for details on customizing permissions, channels, and quotas.
