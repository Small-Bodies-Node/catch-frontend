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
  private concurrentLimit: number = 4; // 4 is tested as best
  private activeRequests: number = 0;
  private imageCache: { [url: string]: string } = {}; // Cache object URLs
  private retryLimit: number = 200;
  private retryCount: number = 0;
  private mostRecentTaskErrorDate?: Date;
  private mostRecentTaskFinishDate?: Date;
  private mostRecentTaskStartDate?: Date;
  private startDate?: Date;

  fetchCallCount: number = 0;

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
   * Return undefined => failed after multiple retries
   */
  async fetchImage(
    url: string,
    options?: IOptions
  ): Promise<string | undefined> {
    if (!this.startDate) this.startDate = new Date();

    if (this.imageCache[url]) {
      return this.imageCache[url];
    }

    const isQueueNeeded =
      url.includes('uxzqjwo0ye') ||
      url.includes('skymapper') ||
      url.includes('neat');

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

    const isFetchableFromS3 = true && url.includes('uxzqjwo0ye');
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

    // Add task to queue
    const taskResult = await new Promise<string>((resolve, reject) => {
      const { isPriority, label } = { ...defaultOptions, ...options };
      const task: IFetchTask = { url, isPriority, resolve, reject, label };
      isPriority ? this.queue.unshift(task) : this.queue.push(task);
      this.checkQueue();
    }).catch((_) => {
      return 'retry';
    });

    // Recursive retry logic
    if (taskResult === 'retry') {
      if (this.retryCount < this.retryLimit) {
        console.log('Retrying fetchImage', this.retryCount, url);
        this.retryCount++;
        return this.fetchImage(url, options);
      } else {
        return undefined;
      }
    } else {
      return taskResult;
    }
  }

  private checkQueue() {
    if (this.activeRequests >= this.concurrentLimit) return;
    if (this.queue.length === 0) return;

    const task = this.queue.shift()!;
    this.activeRequests++;
    this.logTaskStart();
    const minDelayMs = 100;
    const delayMs =
      this.activeRequests < this.concurrentLimit
        ? (this.activeRequests % this.concurrentLimit) * minDelayMs
        : minDelayMs;
    setTimeout(() => this.processTask(task), delayMs);
  }

  private async processTask(task: IFetchTask) {
    const onProcessCompletion = () => {
      this.logTaskFinish();
      this.activeRequests--;
      this.checkQueue();
    };

    try {
      this.fetchCallCount++;
      if (isDebug) {
        colog('>>> Fetch Call Count', this.fetchCallCount, task.label, 'green');
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
      return undefined;
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

  logTaskStart() {
    if (!isDebug) return;
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
    colog('>>> Task Start At :', timeSinceStartMs, color);
    colog('Most Recent Finish:', timeSinceMostRecentTaskFinishMs, color);
    colog('Most Recent Error :', timeSinceMostRecentErrorMs, color);
  }

  logTaskFinish() {
    if (!isDebug) return;
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
    if (!isDebug) return;
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
