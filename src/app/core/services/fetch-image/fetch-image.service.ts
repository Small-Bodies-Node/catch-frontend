import { Injectable } from '@angular/core';
import { swapRaDecInFilename } from '../../../../utils/swapRaDecInFilename';

interface FetchTask {
  url: string;
  isPriority: boolean;
  minProcessTimeMs: number;
  resolve: (value: string | PromiseLike<string>) => void; // Now resolves to an object URL string
  reject: (reason?: any) => void;
  label: string;
}

interface IOptions {
  isPriority: boolean;
  label: string;
  minProcessTimeMs: number;
}

const defaultOptions: IOptions = {
  isPriority: false,
  label: '-',
  minProcessTimeMs: 200,
};

@Injectable({
  providedIn: 'root',
})
export class ImageFetchService {
  private queue: FetchTask[] = [];
  private concurrentLimit: number = 2;
  private activeRequests: number = 0;
  private imageCache: { [url: string]: string } = {}; // Cache object URLs

  constructor() {
    // Clear imageCache every hour
    setInterval(() => {
      Object.values(this.imageCache).forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl); // Clean up object URLs
      });
      this.imageCache = {};
    }, 1000 * 60 * 60);
  }

  resetQueue() {
    this.queue = [];
    this.activeRequests = 0;
  }

  async fetchImage(url: string, options?: IOptions): Promise<string> {
    // Decide if this URL can skip queue
    const isQueueNeeded =
      url.includes('catalina') ||
      // url.includes('neat') ||
      url.includes('spacewatch');
    // url.includes('lon') // Add loneos!!!!

    if (!isQueueNeeded) {
      return fetch(url)
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob));
    }

    // Check if image is already cached
    if (this.imageCache[url]) {
      console.log('Image already in cache!');
      return this.imageCache[url];
    }

    // Test if Catalina image is cached in S3
    const isFetchableFromS3 =
      url.includes('catalina') || url.includes('spacewatch');
    // ||  add loneos
    if (isFetchableFromS3) {
      const fileUrlInS3Bucket = await this.getCatalinaImageCachedInS3(url);
      if (fileUrlInS3Bucket) {
        return fetch(fileUrlInS3Bucket)
          .then((response) => response.blob())
          .then((blob) => {
            const objectUrl = URL.createObjectURL(blob);
            this.imageCache[url] = objectUrl;
            return objectUrl;
          });
      }
    }

    // Begin queue logic
    const { isPriority, label, minProcessTimeMs } = {
      ...defaultOptions,
      ...options,
    };
    return new Promise((resolve, reject) => {
      const task: FetchTask = {
        url,
        isPriority,
        minProcessTimeMs,
        resolve,
        reject,
        label,
      };

      // Add task to queue
      if (isPriority) {
        this.queue.unshift(task);
      } else {
        this.queue.push(task);
      }

      this.checkQueue();
    });
  }

  private checkQueue() {
    if (this.activeRequests < this.concurrentLimit && this.queue.length > 0) {
      this.activeRequests++;
      const task = this.queue.shift()!;
      this.processTask(task);
    }
  }

  private async processTask(task: FetchTask) {
    const startTime = performance.now();

    const onProcessCompletion = () => {
      this.activeRequests--;
      this.checkQueue();
    };

    try {
      const response = await fetch(task.url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const processingTime = performance.now() - startTime;
      if (processingTime < task.minProcessTimeMs) {
        setTimeout(() => {
          onProcessCompletion();
          this.imageCache[task.url] = objectUrl;
          task.resolve(objectUrl);
        }, task.minProcessTimeMs - processingTime);
      } else {
        onProcessCompletion();
        this.imageCache[task.url] = objectUrl;
        task.resolve(objectUrl);
      }
    } catch (error) {
      onProcessCompletion();
      task.reject(error);
    }
  }

  private async getCatalinaImageCachedInS3(
    url: string
  ): Promise<string | undefined> {
    const fileUrlInS3Bucket =
      `https://dkbhqxdnxmt7r.cloudfront.net/` +
      `${this.convertUrlToFileNameInS3Bucket(url)}`;
    try {
      const response = await fetch(fileUrlInS3Bucket, { method: 'HEAD' }).catch(
        (_) => {
          console.log('Error fetching from S3', fileUrlInS3Bucket, _);
        }
      );
      if (response?.status === 200) {
        return fileUrlInS3Bucket;
      }
    } catch (err) {
      console.log('Caught error:', err);
    }
    return undefined;
  }

  private convertUrlToFileNameInS3Bucket(fullUrl: string): string {
    const lastSlashIndex = fullUrl.lastIndexOf('/');
    let contentAfterLastSlash =
      lastSlashIndex === -1 ? fullUrl : fullUrl.substring(lastSlashIndex + 1);

    let safeFilename = contentAfterLastSlash.replace(/[/:?&=.]/g, '_');
    if (/(_format_jpg|_format_jpeg)/i.test(safeFilename)) {
      safeFilename = safeFilename.replace(/_format_jpeg/i, '') + '.jpeg';
    } else if (/_format_fits/i.test(safeFilename)) {
      safeFilename = safeFilename.replace(/_format_fits/i, '') + '.fits';
    }

    return swapRaDecInFilename(safeFilename);
  }
}
