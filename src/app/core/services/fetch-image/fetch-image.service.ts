import { Injectable } from '@angular/core';
import { swapRaDecInFilename } from '../../../../utils/swapRaDecInFilename';
import { colog } from '../../../../utils/colog';

interface FetchTask {
  url: string;
  isPriority: boolean;
  minProcessTimeMs: number;
  resolve: (value: string | undefined) => void; // Now resolves to an object URL string
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
  minProcessTimeMs: 100,
};

@Injectable({
  providedIn: 'root',
})
export class ImageFetchService {
  private queue: FetchTask[] = [];
  private concurrentLimit: number = 5;
  private activeRequests: number = 0;
  private imageCache: { [url: string]: string } = {}; // Cache object URLs

  callCount: number = 0;

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

  async fetchImage(
    url: string,
    options?: IOptions
  ): Promise<string | undefined> {
    // ): Promise<any> {
    //

    // Decide if this URL can skip queue
    const isQueueNeeded =
      url.includes('uxzqjwo0ye') ||
      url.includes('catalina') ||
      url.includes('skymapper') ||
      url.includes('spacewatch') ||
      url.includes('loneos');
    // url.includes('neat') ||

    if (!isQueueNeeded) {
      const objectUrl = fetch(url)
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob));
      return objectUrl;
    }

    // Check if image is already cached
    if (this.imageCache[url]) {
      console.log('Image already in cache!');
      return this.imageCache[url];
    }

    // Test if Catalina image is cached in S3
    const isFetchableFromS3 = !false && url.includes('uxzqjwo0ye');

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

    const promisedString = new Promise<string | undefined>(
      (resolve, reject) => {
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
      }
    );

    return promisedString;

    // if (typeof promisedString === 'string') {
    //   return promisedString;
    // } else {
    //   // Recursion till we get it!
    //   // return this.fetchImage(url, options);
    //   return promisedString;
    // }
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
      this.callCount++;
      if (!true) {
        colog(
          '>>> fetchImage Call Count',
          this.callCount,
          task.label,
          'orange'
        );
      }
      const objectUrl = await fetch(task.url)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .catch((_) => {
          console.log('Error fetching', task.url, _);
          return undefined;
        });
      // const blob = await response.blob();
      // const objectUrl = URL.createObjectURL(blob);

      // const processingTime = performance.now() - startTime;

      if (typeof objectUrl === 'string') {
        setTimeout(() => {
          onProcessCompletion();
          this.imageCache[task.url] = objectUrl;
          task.resolve(objectUrl);
        }, task.minProcessTimeMs);
      } else {
        setTimeout(() => {
          onProcessCompletion();
          task.resolve(objectUrl);
        }, task.minProcessTimeMs * 3);
      }

      // if (processingTime < task.minProcessTimeMs) {
      //   setTimeout(() => {
      //     onProcessCompletion();
      //     this.imageCache[task.url] = objectUrl;
      //     task.resolve(objectUrl);
      //   }, task.minProcessTimeMs - processingTime);
      // } else {
      //   onProcessCompletion();
      //   this.imageCache[task.url] = objectUrl;
      //   task.resolve(objectUrl);
      // }
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
