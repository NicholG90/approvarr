import type { QuotaCheckResult } from '../interfaces/overseerr.js';
import { overseerrApi } from './apis/overseerr/overseerrApi.js';

export async function checkUserQuota(
  overseerrUserId: number,
  mediaType: 'movie' | 'tv',
): Promise<QuotaCheckResult> {
  try {
    const quotaResponse = await overseerrApi(`/user/${overseerrUserId}/quota`, 'GET');
    const quotaData = quotaResponse.data;

    const mediaQuota = mediaType === 'movie' ? quotaData.movie : quotaData.tv;
    const days = quotaData.days || 7;

    if (!mediaQuota) {
      return {
        hasQuota: true,
        remaining: Infinity,
        limit: Infinity,
        used: 0,
        mediaType,
        restricted: false,
        days,
      };
    }

    if (mediaQuota.limit === undefined || mediaQuota.limit === null || mediaQuota.limit === 0) {
      return {
        hasQuota: true,
        remaining: Infinity,
        limit: Infinity,
        used: mediaQuota.used || 0,
        mediaType,
        restricted: mediaQuota.restricted || false,
        days,
      };
    }

    const limit = mediaQuota.limit;
    const used = mediaQuota.used || 0;
    const remaining = mediaQuota.remaining !== undefined ? mediaQuota.remaining : Math.max(0, limit - used);
    const restricted = mediaQuota.restricted || false;
    const hasQuota = !restricted && remaining > 0;

    return {
      hasQuota,
      remaining,
      limit,
      used,
      mediaType,
      restricted,
      days,
    };
  }
  catch (error) {
    console.error(`Error checking quota for user ${overseerrUserId}:`, error);

    return {
      hasQuota: true,
      remaining: Infinity,
      limit: Infinity,
      used: 0,
      mediaType,
      restricted: false,
      days: 7,
    };
  }
}

export function formatQuotaMessage(quota: QuotaCheckResult): string {
  const daysText = quota.days ? ` in the last ${quota.days} day${quota.days === 1 ? '' : 's'}` : '';

  if (quota.limit === Infinity) {
    return `No ${quota.mediaType} quota restrictions.`;
  }

  if (quota.restricted) {
    return `❌ **Quota exceeded!** You've used ${quota.used}/${quota.limit} ${quota.mediaType} requests${daysText}.`;
  }

  return `📊 **Quota Status:** ${quota.used}/${quota.limit} ${quota.mediaType} requests used${daysText} (${quota.remaining} remaining).`;
}
