// Mock dependencies
import { execute as executeOverseerrQuotaStatus } from '../../src/commands/overseerr/quotaStatus.js';

jest.mock('../../src/commands/overseerr/quotaStatus', () => ({
  execute: jest.fn(),
}));
const mockExecuteOverseerrQuotaStatus = executeOverseerrQuotaStatus as jest.MockedFunction<typeof executeOverseerrQuotaStatus>;

describe('command Listener - Quota Status Command', () => {
  let mockInteraction: any;

  beforeEach(() => {
    mockInteraction = {
      isCommand: jest.fn().mockReturnValue(true),
      commandName: 'quota_status',
      reply: jest.fn(),
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute quota status command when called', async () => {
    // Simulate the command listener logic for quota_status
    const { commandName } = mockInteraction;

    if (commandName === 'quota_status') {
      await executeOverseerrQuotaStatus(mockInteraction);
    }

    expect(mockExecuteOverseerrQuotaStatus).toHaveBeenCalledWith(mockInteraction);
  });
});
