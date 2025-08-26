import { overseerrApi } from './apis/overseerr/overseerrApi.js';

export async function getDiscordUserIds(): Promise<Record<number, string | null>> {
  try {
    const getUserCount = async (): Promise<number> => {
      const response = await overseerrApi('/user', 'GET', { take: 1 });
      return response.data.pageInfo.results;
    };

    const getAllUserIds = async (): Promise<number[]> => {
      const totalUsers = await getUserCount();
      const response = await overseerrApi(`/user?take=${totalUsers}`, 'GET');
      return response.data.results.map((user: any) => user.id);
    };

    const getDiscordId = async (overseerrId: number): Promise<string | null> => {
      const response = await overseerrApi(`/user/${overseerrId}`, 'GET');
      return response.data.settings?.discordId || null;
    };

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
