export const issueReasons = ['Audio', 'Subtitles', 'Video', 'Other'].map(issue => ({
  label: issue,
  value: issue,
}));
export enum issueType {
  VIDEO = 1,
  AUDIO = 2,
  SUBTITLES = 3,
  OTHER = 4,
}

export enum issueStatus {
  OPEN = 1,
  RESOLVED = 2,
}
