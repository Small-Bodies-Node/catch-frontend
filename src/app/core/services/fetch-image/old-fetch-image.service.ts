import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageFetchService {
  private queue: { loadImage: () => Promise<void>; url: string }[] = [];
  private urlMap: Map<string, { loadImage: () => Promise<void>; url: string }> =
    new Map();
  private concurrentFetchLimit: number = 1;
  private activeRequests = 0;
  private minTimeMs: number = 5000;

  constructor() {}

  private processQueue(): void {
    // console.log(this.urlMap);
    if (
      this.activeRequests < this.concurrentFetchLimit &&
      this.queue.length > 0
    ) {
      const taskWrapper = this.queue.shift();
      if (taskWrapper) {
        this.activeRequests++;
        const startTime = Date.now();
        taskWrapper.loadImage().finally(() => {
          const endTime = Date.now();
          const timeElapsed = endTime - startTime;
          const delay = Math.max(0, this.minTimeMs - timeElapsed);
          setTimeout(() => {
            this.activeRequests--;
            this.processQueue();
          }, delay);
        });
      }
    }
  }

  fetchImage(
    url: string,
    isPriority: boolean = false
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const loadImage = async () => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      };

      const taskWrapper = { loadImage, url };

      // Check if the URL is already queued
      if (this.urlMap.has(url)) {
        // Find and replace the existing task with the new taskWrapper
        const index = this.queue.findIndex((item) => item.url === url);
        if (index !== -1) {
          this.queue[index] = taskWrapper; // Replace the existing task
        }
      } else {
        this.urlMap.set(url, taskWrapper);
      }

      // Add or prioritize the task in the queue
      if (isPriority) {
        this.queue.unshift(taskWrapper);
      } else {
        // If not replacing an existing task, add to the end
        if (!this.urlMap.has(url)) {
          this.queue.push(taskWrapper);
        }
      }

      this.processQueue();
    });
  }
}
