# Season Requests Implementation

## Overview

This documentation describes the implementation of TV season selection functionality for the Approvarr Discord bot. Users can now select specific seasons when requesting TV shows through Discord interactions.

## Key Components

### 1. TV Season Select Handler (`tvSeasonSelectHandler.ts`)

**Purpose**: Handles the initial season selection when a user chooses a TV show.

**Features**:
- Fetches season data from Overseerr API
- Creates dynamic season options based on available seasons
- Filters out special seasons (Season 0)
- Includes "All Seasons" option
- Handles Discord's 25-option limit for select menus
- Provides fallback options if API call fails

**Flow**:
1. User selects a TV show from media select menu
2. Handler fetches TV details from Overseerr
3. Creates season select menu with available seasons
4. Updates interaction with season selection interface

### 2. TV Season Submit Handler (`tvSeasonSubmitHandler.ts`)

**Purpose**: Processes the user's season selection and prepares the request interface.

**Features**:
- Validates selected seasons against available seasons
- Formats season information for display
- Updates embed with selected season information
- Creates appropriate request button based on media status
- Comprehensive error handling and user feedback

**Flow**:
1. User selects desired seasons
2. Handler validates the selection
3. Updates embed with season information
4. Shows request button or status message

### 3. Enhanced Button Listener

**Purpose**: Handles the actual request submission with season data.

**Enhancements**:
- New `requestTvWithSeasons` button type
- Extracts season information from embed
- Formats season data for Overseerr API
- Supports both specific seasons and "all seasons" requests

### 4. Updated Select Listener

**Purpose**: Routes different types of select menu interactions.

**Changes**:
- Added `tvSeasonSelect` case handler
- Improved flow for TV vs Movie requests
- Better embed preservation between interactions

### 5. Enhanced Type Safety

**New Interfaces**:
- `TvSeason`: Represents individual season data
- `TvSeriesDetails`: Represents complete TV series information

## User Experience Flow

### TV Show Request Process:

1. **Initial Request**: User runs `/request_tv` command
2. **Media Selection**: User selects TV show from search results
3. **Season Selection**: User selects desired seasons from dynamic list
4. **Request Submission**: User clicks "Request" button to submit

### Season Selection Options:

- **All Seasons**: Requests all available seasons
- **Individual Seasons**: Select one or more specific seasons
- **Multiple Selection**: Users can select multiple seasons at once

## API Integration

### Overseerr API Endpoints Used:

- `GET /tv/{id}`: Fetch TV series details and seasons
- `POST /request/`: Submit request with season data

### Season Data Format:

For API requests:
- All seasons: `"seasons": "all"`
- Specific seasons: `"seasons": [1, 2, 3]`

## Error Handling

### Validation:
- Checks if seasons are available for the TV series
- Validates user input before API calls
- Provides clear error messages for invalid selections

### Fallbacks:
- Default season options if API fails
- Graceful degradation for older TV series without season data
- User-friendly error messages for all failure scenarios

## Configuration

No additional configuration required. The feature works with existing Overseerr setup.

## Compatibility

- Works with both Overseerr and Jellyseerr
- Compatible with existing Discord bot permissions
- Backward compatible with existing movie request functionality

## Testing Considerations

### Test Cases:
1. TV show with multiple seasons
2. TV show with only one season
3. TV show with special seasons (Season 0)
4. API failures and network issues
5. Invalid season selections
6. Discord interaction timeouts

### Edge Cases Handled:
- TV series with 25+ seasons (Discord select menu limit)
- Missing season data from API
- Network timeouts during season fetching
- Invalid media IDs
- Permission failures during request submission

## Future Enhancements

Potential improvements:
1. Season status indicators (available/pending/failed)
2. Episode-level selection for specific seasons
3. Bulk season operations for series with many seasons
4. Season request progress tracking
5. Integration with download client status

## Files Modified/Added

### New Files:
- `src/handlers/selectHandlers/tvSeasonSelectHandler.ts`
- `src/handlers/selectHandlers/tvSeasonSubmitHandler.ts`

### Modified Files:
- `src/listeners/selectListener.ts`
- `src/listeners/buttonListener.ts`
- `src/interfaces/overseerr.ts`

## Deployment Notes

1. Rebuild the project: `npm run build`
2. Restart the Discord bot
3. No database migrations required
4. No configuration changes needed
