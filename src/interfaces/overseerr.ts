export interface OverseerrSearchMediaResults {
  title?: string;
  name?: string;
  id: number;
  firstAirDate?: string;
  releaseDate?: string;
  mediaType: string;
  mediaInfo: {
    id: number;
  };
}

export interface TvSeason {
  seasonNumber: number;
  episodeCount?: number;
  airDate?: string;
  overview?: string;
}

export interface TvSeriesDetails {
  id: number;
  name: string;
  overview: string;
  posterPath: string;
  firstAirDate: string;
  seasons?: TvSeason[];
  mediaInfo?: {
    id: number;
    status: number;
  };
}

export interface UserQuota {
  movie: QuotaDetails;
  tv: QuotaDetails;
}

export interface QuotaDetails {
  used: number;
  limit: number;
  remaining: number;
  restricted: boolean;
}

export interface QuotaCheckResult {
  hasQuota: boolean;
  remaining: number;
  limit: number;
  used: number;
  mediaType: 'movie' | 'tv';
  restricted: boolean;
  days?: number;
}

export interface IssueEpisodeInfo {
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle?: string;
}

export interface IssueMediaInfo {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
}

export interface IssueCreationData {
  issueType: 'video' | 'audio' | 'subtitle' | 'other';
  message: string;
  mediaInfo: IssueMediaInfo;
}
