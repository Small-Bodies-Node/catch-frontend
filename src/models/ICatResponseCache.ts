export interface ICatResponseCache {
  enabled: boolean;
  hit: boolean;
  key?: string | null;
  error?: string;
}
