import { Injectable } from '@angular/core';

interface FetchTask {
  url: string;
  isPriority: boolean;
  minProcessTimeMs: number;
  resolve: (value: HTMLImageElement | PromiseLike<HTMLImageElement>) => void;
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
  private concurrentLimit: number = 2;
  private activeRequests: number = 0;

  constructor() {}

  async fetchImage(url: string, options?: IOptions): Promise<HTMLImageElement> {
    // --->

    // Decide if this URL can skip queue
    const isQueueNeeded = url.includes('catalina') || url.includes('neat');
    if (!isQueueNeeded) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onerror = () => reject(new Error(url));
        image.onload = () => resolve(image);
        image.src = url;
      });
    }

    // Test if Catalina image is cached in S3. If yes, then return that instead
    if (url.includes('catalina')) {
      const fileUrlInS3Bucket =
        false && (await this.getCatalinaImageCachedInS3(url));
      if (fileUrlInS3Bucket) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onerror = () => reject(new Error(fileUrlInS3Bucket));
          image.onload = () => resolve(image);
          image.src = fileUrlInS3Bucket;
        });
      }
    }

    // Begin queue logic
    const { isPriority, label, minProcessTimeMs } = {
      ...defaultOptions,
      ...options,
    };
    return new Promise((resolve, reject) => {
      // Remove existing task for the same URL.
      // this.queue = this.queue.filter((task) => task.url !== url);

      // Create a new task for this url
      const task: FetchTask = {
        url,
        isPriority,
        minProcessTimeMs,
        resolve,
        reject,
        label,
      };

      // Add the task to the queue based on priority.
      if (isPriority) {
        this.queue.unshift(task);
      } else {
        this.queue.push(task);
      }

      this.checkQueue();
    });
  }

  private checkQueue() {
    this.queue.map((task) => {
      // console.log('>>> ', task.refNum);
    });
    false &&
      console.log(
        '>>> ',
        this.activeRequests,
        this.queue.map((task) => task.label)
      );
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
      const image = new Image();
      image.onerror = () => {
        onProcessCompletion();
        task.reject(new Error('Sth went wrong loading image'));
      };
      image.onload = () => {
        const processingTime = performance.now() - startTime;
        if (processingTime < task.minProcessTimeMs) {
          setTimeout(() => {
            onProcessCompletion();
            task.resolve(image);
          }, task.minProcessTimeMs - processingTime);
        } else {
          onProcessCompletion();
          task.resolve(image);
        }
      };
      image.src = task.url;
    } catch (error) {
      onProcessCompletion();
      task.reject(error);
    }
  }

  private async getCatalinaImageCachedInS3(
    url: string
  ): Promise<string | undefined> {
    // --->

    // IMPORTANT! You MUST use cloudfront to make HEAD requests to S3
    // See here: https://serverfault.com/a/1132389/498437
    const fileUrlInS3Bucket =
      `https://dkbhqxdnxmt7r.cloudfront.net/` +
      `${this.convertUrlToFileNameInS3Bucket(url)}`;
    try {
      const response = await fetch(fileUrlInS3Bucket, { method: 'HEAD' }).catch(
        (_) => {
          console.log('Error fetching from S3');
          console.log(fileUrlInS3Bucket);
          console.log(_);
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

  /**
   * This logic has to EXACTLY correspond to the logic in the lambda function
   * given in file `get_file_name.py` in [this repo](https://github.com/Small-Bodies-Node/sbn-survey-image-service-aws)
   */
  private convertUrlToFileNameInS3Bucket(fullUrl: string): string {
    // Extract the content after the last '/'
    const lastSlashIndex = fullUrl.lastIndexOf('/');
    let contentAfterLastSlash: string;
    if (lastSlashIndex === -1) {
      contentAfterLastSlash = fullUrl;
    } else {
      contentAfterLastSlash = fullUrl.substring(lastSlashIndex + 1);
    }

    // Convert to a file-name friendly format
    let safeFilename = contentAfterLastSlash.replace(/[/:?&=.]/g, '_');

    // "..._format_jpeg..." -> "... .jpeg", etc.
    if (
      /_format_jpg/i.test(safeFilename) ||
      /_format_jpeg/i.test(safeFilename)
    ) {
      safeFilename = safeFilename.replace(/_format_jpeg/i, '') + '.jpeg';
    } else if (/_format_fits/i.test(safeFilename)) {
      safeFilename = safeFilename.replace(/_format_fits/i, '') + '.fits';
    }

    return safeFilename;
  }
}
