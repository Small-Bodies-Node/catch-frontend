import { FormControl } from '@angular/forms';
import {
  controlLabelsDictForSources,
  sourceFormControlDict,
} from './TControlKeyForSources';
import { nonNullable } from '../utils/nonNullable';
import { TIntersectionType } from './TIntersectionType';

export const lowerFormControlDict = {
  ...sourceFormControlDict,
  use_cached_results_control: new FormControl<boolean>(true, nonNullable),
  uncertainty_ellipse_control: new FormControl<boolean>(false, nonNullable),
  padding_input_control: new FormControl<number>(0, nonNullable),
  intersection_type_input_control: new FormControl<TIntersectionType>(
    'image_intersects_area',
    nonNullable
  ),
  start_time_input_control: new FormControl<string>('', nonNullable),
  stop_time_input_control: new FormControl<string>('', nonNullable),
  select_all_sources_control: new FormControl<boolean>(true, nonNullable),
} as const;

export const controlKeysForLowerForm = Object.keys(
  lowerFormControlDict
) as Array<keyof typeof lowerFormControlDict>;

export type TControlKeyForLowerForm = (typeof controlKeysForLowerForm)[number];

export const controlLabelsDictForLowerForm: {
  [K in TControlKeyForLowerForm]: string;
} = {
  ...controlLabelsDictForSources,
  padding_input_control: 'Padding',
  uncertainty_ellipse_control: 'Uncertainty Ellipse',
  use_cached_results_control: 'Use Cached Results',
  select_all_sources_control: 'Select All Sources',
  start_time_input_control: 'Start Time',
  stop_time_input_control: 'Stop Time',
  intersection_type_input_control: 'Intersection Type',
};
