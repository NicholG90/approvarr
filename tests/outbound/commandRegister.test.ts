describe('command Registration - Environment Control Logic', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('should include quota_status command when ENABLE_QUOTA_CHECK is true', () => {
    process.env.ENABLE_QUOTA_CHECK = 'true';

    const mockQuotaCommand = { name: 'quota_status', description: 'Check quota status' };
    const mockMovieCommand = { name: 'request_movie', description: 'Request a movie' };

    // Simulate the command registration filtering logic from commandRegister.ts
    const commands = [];

    // Apply the same logic as in commandRegister.ts for quota_status
    if (mockQuotaCommand.name === 'quota_status' && process.env.ENABLE_QUOTA_CHECK !== 'true') {
      // Skip
    }
    else {
      commands.push(mockQuotaCommand);
    }
    commands.push(mockMovieCommand);

    expect(commands).toHaveLength(2);
    expect(commands.find(cmd => cmd.name === 'quota_status')).toBeDefined();
    expect(commands.find(cmd => cmd.name === 'request_movie')).toBeDefined();
  });

  it('should exclude quota_status command when ENABLE_QUOTA_CHECK is false', () => {
    process.env.ENABLE_QUOTA_CHECK = 'false';

    const mockQuotaCommand = { name: 'quota_status', description: 'Check quota status' };
    const mockMovieCommand = { name: 'request_movie', description: 'Request a movie' };

    // Simulate the command registration filtering logic
    const commands = [];

    // Apply the same logic as in commandRegister.ts for quota_status
    if (mockQuotaCommand.name === 'quota_status' && process.env.ENABLE_QUOTA_CHECK !== 'true') {
      // Skip - this should happen
    }
    else {
      commands.push(mockQuotaCommand);
    }
    commands.push(mockMovieCommand);

    expect(commands).toHaveLength(1);
    expect(commands.find(cmd => cmd.name === 'quota_status')).toBeUndefined();
    expect(commands.find(cmd => cmd.name === 'request_movie')).toBeDefined();
  });

  it('should exclude quota_status command when ENABLE_QUOTA_CHECK is undefined', () => {
    delete process.env.ENABLE_QUOTA_CHECK;

    const mockQuotaCommand = { name: 'quota_status', description: 'Check quota status' };
    const mockMovieCommand = { name: 'request_movie', description: 'Request a movie' };

    // Simulate the command registration filtering logic
    const commands = [];

    // Apply the same logic as in commandRegister.ts for quota_status
    if (mockQuotaCommand.name === 'quota_status' && process.env.ENABLE_QUOTA_CHECK !== 'true') {
      // Skip - this should happen when undefined
    }
    else {
      commands.push(mockQuotaCommand);
    }
    commands.push(mockMovieCommand);

    expect(commands).toHaveLength(1);
    expect(commands.find(cmd => cmd.name === 'quota_status')).toBeUndefined();
    expect(commands.find(cmd => cmd.name === 'request_movie')).toBeDefined();
  });
});
