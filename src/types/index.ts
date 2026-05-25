export type Platform = 'windows' | 'mac' | 'linux';

export interface DownloadStats {
  platform: Platform;
  count: number;
}
