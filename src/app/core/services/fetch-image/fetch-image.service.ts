import { Injectable } from '@angular/core';
import { swapRaDecInFilename } from '../../../../utils/swapRaDecInFilename';
import { colog } from '../../../../utils/colog';

const isDebug = false;

interface IFetchTask {
  url: string;
  isPriority: boolean;
  resolve: (value: string) => void; // value === objectUrl or 'retry'
  reject: (value: 'retry') => void;
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
  private concurrentLimit: number = 7;
  private activeRequests: number = 0;
  private imageCache: { [url: string]: string } = {}; // Cache object URLs
  private retryLimit: number = 200;
  private retryCount: number = 0;
  private mostRecentTaskErrorDate?: Date;
  private mostRecentTaskFinishDate?: Date;
  private mostRecentTaskStartDate?: Date;
  private startDate?: Date;

  callCount: number = 0;

  constructor() {
    if (isDebug) console.log('Clearing imageCache every hour');
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

  /**
   * Return string => url of ready image
   * Return undefined => try again later
   */
  async fetchImage(
    url: string,
    options?: IOptions
  ): Promise<string | undefined> {
    if (!this.startDate) this.startDate = new Date();

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
          if (isDebug) console.log('Error fetching', url);
          return undefined;
        });
      if (objectUrl) this.imageCache[url] = objectUrl;
      return objectUrl;
    }

    // Test if image is cached in S3
    const isFetchableFromS3 = false && url.includes('uxzqjwo0ye');
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

    // Add task for url to queue
    const queueResult = await new Promise<string>((resolve, reject) => {
      const task: IFetchTask = { url, isPriority, resolve, reject, label };
      isPriority ? this.queue.unshift(task) : this.queue.push(task);
      this.checkQueue();
    }).catch((_) => {
      return 'retry';
    });

    // Recursive retry logic
    if (queueResult === 'retry') {
      if (this.retryCount < this.retryLimit) {
        console.log('Retrying fetchImage', this.retryCount, url, label);
        this.retryCount++;
        return this.fetchImage(url, options);
      } else {
        return undefined;
      }
    } else {
      return queueResult;
    }
  }

  private checkQueue() {
    if (this.activeRequests >= this.concurrentLimit) return;
    if (this.queue.length === 0) return;

    this.activeRequests++;
    const task = this.queue.shift()!;

    this.logTaskStart(-1);

    /**
     * Delay start of next task until these 3 conditions are met:
     * - X ms have passed since the last error occurred
     * - Y ms have passed since the last task finished
     * - Z ms have passed since the last task started
     */
    const X = 100;
    const Y = 100;
    const Z = 1000;

    const timeSinceLastErrorMs = this.mostRecentTaskErrorDate
      ? new Date().getTime() - this.mostRecentTaskErrorDate.getTime()
      : Z;
    const timeSinceLastTaskFinishedMs = this.mostRecentTaskFinishDate
      ? new Date().getTime() - this.mostRecentTaskFinishDate.getTime()
      : Y;
    const timeSinceLastTaskStartMs = this.mostRecentTaskStartDate
      ? new Date().getTime() - this.mostRecentTaskStartDate.getTime()
      : X;

    const timeSinceStart = this.startDate
      ? new Date().getTime() - this.startDate.getTime()
      : 'N/A';
    colog(
      '>>> ',
      timeSinceStart,
      ' > ',
      timeSinceLastTaskStartMs,
      timeSinceLastTaskFinishedMs,
      timeSinceLastErrorMs,
      'red'
    );

    colog(
      '>>> ',
      timeSinceStart,
      ' > ',
      X - timeSinceLastTaskStartMs,
      Y - timeSinceLastTaskFinishedMs,
      Z - timeSinceLastErrorMs,
      'orange'
    );

    const delayMs = Math.max(
      Math.max(
        Z - timeSinceLastErrorMs,
        Y - timeSinceLastTaskFinishedMs,
        X - timeSinceLastTaskStartMs
      ),
      0
    );

    const minDelayMs = (this.activeRequests % this.concurrentLimit) * 100;

    setTimeout(() => {
      this.processTask(task);
    }, minDelayMs + delayMs * 0);
  }

  private async processTask(task: IFetchTask) {
    const onProcessCompletion = () => {
      this.logTaskFinish();
      this.activeRequests--;
      this.checkQueue();
    };

    try {
      this.callCount++;
      if (true) {
        colog('>>> fetchImage Call Count', this.callCount, task.label, 'green');
      }
      const objectUrl = await fetch(task.url)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .catch((_) => {
          if (isDebug) console.log('Error fetching', task.url, _);
          this.logTaskError();
          return 'retry';
        });

      if (objectUrl !== 'retry') this.imageCache[task.url] = objectUrl;

      onProcessCompletion();
      task.resolve(objectUrl);
    } catch (_) {
      if (isDebug) console.log('Error fetching', task.url, _);
      this.logTaskError();
      onProcessCompletion();
      task.reject('retry');
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
          if (isDebug)
            console.log('Error fetching from S3', fileUrlInS3Bucket, _);
        }
      );
      if (response?.status === 200) {
        return fileUrlInS3Bucket;
      }
      return undefined;
    } catch (err) {
      if (isDebug) console.log('Caught error:', err);
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

  logTaskStart(expectedDelayMs: number) {
    const color = 'cyan';
    const now = new Date();
    this.mostRecentTaskStartDate = now;
    const timeSinceStartMs =
      this.mostRecentTaskStartDate.getTime() - this.startDate!.getTime();
    const timeSinceMostRecentTaskFinishMs = this.mostRecentTaskFinishDate
      ? now.getTime() - this.mostRecentTaskFinishDate.getTime()
      : 'N/A';
    const timeSinceMostRecentErrorMs = this.mostRecentTaskErrorDate
      ? now.getTime() - this.mostRecentTaskErrorDate.getTime()
      : 'N/A';
    colog('>>> Task Start At :', timeSinceStartMs, expectedDelayMs, color);
    colog('Most Recent Finish:', timeSinceMostRecentTaskFinishMs, color);
    colog('Most Recent Error :', timeSinceMostRecentErrorMs, color);
  }

  logTaskFinish() {
    const color = 'purple';
    const now = new Date();
    this.mostRecentTaskFinishDate = now;
    const timeSinceStartMs =
      this.mostRecentTaskFinishDate.getTime() - this.startDate!.getTime();
    const timeSinceMostRecentTaskStartMs = this.mostRecentTaskStartDate
      ? now.getTime() - this.mostRecentTaskStartDate.getTime()
      : 'N/A';
    const timeSinceMostRecentErrorMs = this.mostRecentTaskErrorDate
      ? now.getTime() - this.mostRecentTaskErrorDate.getTime()
      : 'N/A';
    colog('>>> Task Finish At :', timeSinceStartMs, color);
    colog('Most Recent Start  :', timeSinceMostRecentTaskStartMs, color);
    colog('Most Recent Error  :', timeSinceMostRecentErrorMs, color);
  }

  logTaskError() {
    const color = 'pink';
    const now = new Date();
    this.mostRecentTaskErrorDate = now;
    const timeSinceStartMs =
      this.mostRecentTaskErrorDate.getTime() - this.startDate!.getTime();
    const timeSinceMostRecentTaskStartMs = this.mostRecentTaskStartDate
      ? now.getTime() - this.mostRecentTaskStartDate.getTime()
      : 'N/A';
    const timeSinceMostRecentFinishMs = this.mostRecentTaskFinishDate
      ? now.getTime() - this.mostRecentTaskFinishDate.getTime()
      : 'N/A';
    colog('>>> Task Error At :', timeSinceStartMs, color);
    colog('Most Recent Start  :', timeSinceMostRecentTaskStartMs, color);
    colog('Most Recent Error  :', timeSinceMostRecentFinishMs, color);
  }
}
