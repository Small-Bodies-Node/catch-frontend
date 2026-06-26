export type ThumbnailLoadPriority = 'high' | 'normal';

export type ThumbnailLoadCacheSource = 'memory' | 'persistent-cache' | 'network';

export interface ThumbnailImageRequest {
  url: string;
  source?: string | null;
  sourceName?: string | null;
  label?: string;
  priority?: ThumbnailLoadPriority;
  forceRefresh?: boolean;
}

export interface ThumbnailSourcePolicy {
  bucketId: string;
  maxConcurrent: number;
  minStartDelayMs: number;
  requestTimeoutMs: number;
  persistentTtlMs: number;
  usePersistentCache: boolean;
}

export interface ThumbnailLoadingState {
  status: 'loading';
  originalUrl: string;
  bucketId: string;
}

export interface ThumbnailSuccessState {
  status: 'success';
  originalUrl: string;
  bucketId: string;
  objectUrl: string;
  loadedFrom: ThumbnailLoadCacheSource;
}

export interface ThumbnailErrorState {
  status: 'error';
  originalUrl: string;
  bucketId: string;
  message: string;
}

export type ThumbnailImageState =
  | { status: 'idle' }
  | ThumbnailLoadingState
  | ThumbnailSuccessState
  | ThumbnailErrorState;

export type ThumbnailLoadResult = ThumbnailSuccessState | ThumbnailErrorState;
