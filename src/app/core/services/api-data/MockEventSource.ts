import { IApiServiceStream } from '../../../../models/IApiServiceStream';
import { ISearchParamsMoving } from '../../../../models/ISearchParamsMoving';
import { mockMessageIntervalMs } from '../../../../utils/constants';
import { getMockStreamMessages } from '../../../../utils/getMockStreamMessages';

/**
 * ...
 */
export class MockEventSource implements EventSource {
  // Satisfy the constants from the real EventSource interface
  public static CONNECTING = 0;
  public static OPEN = 1;
  public static CLOSED = 2;

  // The instance properties
  public CONNECTING = 0 as const;
  public OPEN = 1 as const;
  public CLOSED = 2 as const;

  // The standard read-only properties
  public url = '';
  public withCredentials = false;
  public readyState: 0 | 1 | 2 = this.CONNECTING; // start out CONNECTING

  // The onXxx handlers
  public onopen: ((this: EventSource, ev: Event) => any) | null = null;
  public onmessage: ((this: EventSource, ev: MessageEvent) => any) | null =
    null;
  public onerror: ((this: EventSource, ev: Event) => any) | null = null;

  // We'll store references to each timeout here so we can clear them on close
  private mockTimers: any[] = [];

  // The add/removeEventListener, dispatchEvent from EventTarget
  addEventListener<K extends keyof EventSourceEventMap>(
    type: K,
    listener: (this: EventSource, ev: EventSourceEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    // no-op in this mock
  }

  removeEventListener<K extends keyof EventSourceEventMap>(
    type: K,
    listener: (this: EventSource, ev: EventSourceEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void {
    // no-op in this mock
  }

  dispatchEvent(event: Event): boolean {
    // no-op in this mock
    return false;
  }

  constructor(job_id: string, searchParamsMoving: ISearchParamsMoving) {
    // Simulate “open” after 200ms
    const openTimer = setTimeout(() => {
      if (this.readyState === this.CONNECTING) {
        this.readyState = this.OPEN;
        this.onopen?.(new Event('open'));
      }
    }, 200);
    this.mockTimers.push(openTimer);

    // Now schedule each message in mockStreamMessages
    getMockStreamMessages(job_id, searchParamsMoving).forEach(
      (msg: IApiServiceStream, i: number) => {
        const msgTimer = setTimeout(() => {
          // If we've already closed, don't send messages
          if (this.readyState === this.CLOSED) return;

          // Call onmessage, if present
          this.onmessage?.({
            data: JSON.stringify(msg, null, 2),
          } as MessageEvent);

          // If this message has status 'success' or 'error',
          // you might want to auto-close. Adjust as you see fit.
          if (msg.status === 'success' || msg.status === 'error') {
            this.close();
          }
        }, mockMessageIntervalMs * i); // e.g. 1s per message
        this.mockTimers.push(msgTimer);
      }
    );
  }

  public close(): void {
    // Mark readyState = CLOSED
    this.readyState = this.CLOSED;

    // Clear all scheduled timeouts
    this.mockTimers.forEach(clearTimeout);
    this.mockTimers = [];
  }
}
