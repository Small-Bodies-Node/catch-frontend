import { Injectable } from '@angular/core';
import { swapRaDecInFilename } from '../../../../utils/swapRaDecInFilename';
import { colog } from '../../../../utils/colog';

interface IFetchTask {
  url: string;
  isPriority: boolean;
  resolve: (value: string | undefined) => void; // Now resolves to an object URL string
  reject: (reason?: any) => void;
  label: string;
}

interface IOptions {
  isPriority: boolean;
  label: string;
}

const defaultOptions: IOptions = {
  isPriority: false,
  label: '-',
};

@Injectable({
  providedIn: 'root',
})
export class ImageFetchService {
  private queue: IFetchTask[] = [];
  private concurrentLimit: number = 4;
  private postFetchDelayMs: number = 100;
  private activeRequests: number = 0;
  private imageCache: { [url: string]: string } = {}; // Cache object URLs
  private taskCache: { [url: string]: IFetchTask } = {}; // Cache tasks
  private lastTime = new Date();
  private retryLimit: number = 200;
  private retryCount: number = 0;

  callCount: number = 0;

  constructor() {
    console.log('Clearing imageCache every hour');
    // Clear imageCache every hour
    setInterval(() => {
      Object.values(this.imageCache).forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl); // Clean up object URLs
      });
      this.imageCache = {};
    }, 1000 * 60 * 60);

    this.imageCache = {};
  }

  resetQueue() {
    this.queue = [];
    this.activeRequests = 0;
  }

  /**
   * Return string => url of ready image
   * Return undefined => try again later
   */
  async fetchImage(
    url: string,
    options?: IOptions
  ): Promise<string | undefined> {
    // Check if image is already cached
    if (this.imageCache[url]) {
      return this.imageCache[url];
    }

    // Decide if this URL can skip queue
    const isQueueNeeded =
      url.includes('uxzqjwo0ye') ||
      url.includes('skymapper') ||
      url.includes('neat');
    // url.includes('neat') ||

    if (!isQueueNeeded) {
      const objectUrl = await fetch(url)
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob))
        .catch((_) => {
          console.log('Error fetching', url);
          return undefined;
        });
      if (objectUrl) {
        this.imageCache[url] = objectUrl;
      }
      return objectUrl;
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
          })
          .catch((_) => {
            console.error(`Error fetching from S3 bucket!`, _);
            return undefined;
          });
      }
    }

    // Begin queue logic
    const { isPriority, label } = {
      ...defaultOptions,
      ...options,
    };

    const promisedString = await new Promise<string | undefined>(
      (resolve, reject) => {
        const task: IFetchTask = {
          url,
          isPriority,
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
    ).catch((_) => {
      console.log('Aha!');
      return undefined;
    });

    // return promisedString;

    if (
      typeof promisedString === 'string' ||
      this.retryCount > this.retryLimit
    ) {
      return promisedString;
    } else {
      // Recursion till we get it!
      console.log('Retrying fetchImage', url, label);
      this.retryCount++;
      return this.fetchImage(url, options);
      // return promisedString;
    }
  }

  private checkQueue() {
    if (this.activeRequests < this.concurrentLimit && this.queue.length > 0) {
      this.activeRequests++;
      const task = this.queue.shift()!;

      // Do not start next task until 1 second has passed since the last task started
      const time = new Date();
      const timeSinceLastTimeMs = time.getTime() - this.lastTime.getTime();
      const delayMs = Math.max(0, 100 - timeSinceLastTimeMs);

      setTimeout(() => {
        this.lastTime = new Date();
        this.processTask(task);
      }, delayMs);
    }
  }

  private async processTask(task: IFetchTask) {
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

      if (typeof objectUrl === 'string') {
        setTimeout(() => {
          onProcessCompletion();
          this.imageCache[task.url] = objectUrl;
          task.resolve(objectUrl);
        }, this.postFetchDelayMs);
      } else {
        setTimeout(() => {
          onProcessCompletion();
          task.resolve(objectUrl);
        }, this.postFetchDelayMs * 3);
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
      console.log('Error!');
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
      return undefined;
    } catch (err) {
      console.log('Caught error:', err);
      return Promise.reject(undefined);
    }
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
