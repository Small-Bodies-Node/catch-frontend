import { IApiServiceStream } from '../models/IApiServiceStream';
import { mockJobId } from './mockJobId';

const status = 'running';
const job_prefix = mockJobId.substring(0, 8);

/**
 * Array of objects used to mock streaming of messages from SSE API
 */
export const mockStreamMessages: IApiServiceStream[] = [
  { job_prefix, status, text: 'Starting moving target query.' },
  {
    job_prefix,
    status,
    text: 'Added 5 cached results from NEAT Palomar Tricam.',
  },
  {
    job_prefix,
    status,
    text: 'Added 9 cached results from NEAT Maui GEODSS.',
  },
  { job_prefix, status, text: 'Added 1 cached result from SkyMapper.' },
  {
    job_prefix,
    status,
    text: 'Added 74 cached results from PanSTARRS 1 DR2.',
  },
  {
    job_prefix,
    status,
    text: 'Added 136 cached results from Catalina Sky Survey, Mt. Bigelow.',
  },
  {
    job_prefix,
    text: 'Added 24 cached results from Catalina Sky Survey, Mt. Lemmon.',
    status: 'running',
  },
  {
    job_prefix: '8eb80273',
    text: 'Added 0 cached results from Catalina Sky Survey, Kitt Peak.',
    status: 'running',
  },
  { job_prefix: '8eb80273', text: 'Task complete.', status: 'success' },
];
