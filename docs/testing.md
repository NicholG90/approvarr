# Testing

## Running Tests

Approvarr uses Jest for testing. To run the tests:

```bash
npm test
```

## Test Structure

- All tests are in the `tests/` directory.
- Tests cover commands, handlers, helpers, listeners, and outbound integrations.
- Mocks are used for Discord and Overseerr/Jellyseerr APIs.

## Environment

- Test environment variables are loaded from `.env.test`.
- See `tests/setup.ts` for global test setup.

## Adding Tests

- Add new test files in the appropriate subdirectory under `tests/`.
- Use Jest's mocking features to isolate dependencies.

## Example

See `tests/commands/requestFlow.test.ts` for an example of command flow testing.
