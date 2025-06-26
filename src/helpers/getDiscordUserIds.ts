import { overseerrApi } from './apis/overseerr/overseerrApi';

export async function getDiscordUserIds(): Promise<Record<number, string | null>> {
  try {
    // Get total number of users
    const getUserCount = async (): Promise<number> => {
      const response = await overseerrApi('/user', 'GET', { take: 1 });
      return response.data.pageInfo.results;
    };

    // Get all user IDs
    const getAllUserIds = async (): Promise<number[]> => {
      const totalUsers = await getUserCount();
      const response = await overseerrApi(`/user?take=${totalUsers}`, 'GET');
      return response.data.results.map((user: any) => user.id);
    };

    // Get Discord ID for a specific user
    const getDiscordId = async (overseerrId: number): Promise<string | null> => {
      const response = await overseerrApi(`/user/${overseerrId}`, 'GET');
      return response.data.settings?.discordId || null;
    };

    // Get all users with their Discord IDs
    const userIds = await getAllUserIds();
    const userPromises = userIds.map(async (id) => {
      const discordId = await getDiscordId(id);
      return { id, discordId };
    });

    const usersArray = await Promise.all(userPromises);
    const users: Record<number, string | null> = {};

    usersArray.forEach(({ id, discordId }) => {
      users[id] = discordId;
    });

    return users;
  }
  catch (error) {
    console.error('Error fetching Discord user IDs:', error);
    throw error;
  }
}
