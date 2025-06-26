export interface OverseerrSearchMediaResults {
    title?: string;
    name?: string;
    id: number;
    firstAirDate?: string;
    releaseDate?: string;
    mediaType: string;
    mediaInfo: {
        id: number;
    }
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
