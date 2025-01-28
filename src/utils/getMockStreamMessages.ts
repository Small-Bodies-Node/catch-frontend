import { IApiServiceStream } from '../models/IApiServiceStream';
import { ISearchParamsMoving } from '../models/ISearchParamsMoving';
import {
  controlKeysForSources,
  controlLabelsDictForSources,
} from '../models/TControlKeyForSources';
import { apiMockResultMoving } from './apiMockResultMoving';

export function getMockStreamMessages(
  job_id: string,
  searchParamsMoving: ISearchParamsMoving
): IApiServiceStream[] {
  //
  const job_prefix = job_id.substring(0, 8);
  const { sources, cached } = searchParamsMoving;

  const mockStreamMessages: IApiServiceStream[] = (
    sources || controlKeysForSources
  ).map((source) => {
    //
    const count = apiMockResultMoving.data.filter(
      (datum) => datum.source === source
    ).length;
    return {
      job_prefix,
      status: 'running',
      text: `Added ${count} ${cached ? 'cached' : 'uncached'} results from ${
        controlLabelsDictForSources[source]
      }.`,
    };
  });

  return [
    { job_prefix, status: 'running', text: 'Starting moving target query.' },
    ...mockStreamMessages,
    { job_prefix, text: 'Task complete.', status: 'success' },
  ];
}
