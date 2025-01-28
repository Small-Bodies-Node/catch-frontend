import { FormControl } from '@angular/forms';
import {
  controlLabelsDictForSources,
  sourceFormControlDict,
} from './TControlKeyForSources';
import { nonNullable } from '../utils/nonNullable';
import { TIntersectionType } from './TIntersectionType';
import { TMovingVsFixed } from './TMovingVsFixed';

export const formControlDict = {
  // UPPER
  search_field_control: new FormControl<string>('', nonNullable),

  // MIDDLE
  toggle_moving_vs_fixed_control: new FormControl<TMovingVsFixed>(
    'moving',
    nonNullable
  ),
  show_advanced_options_control: new FormControl<boolean>(true, nonNullable),

  // LOWER
  ...sourceFormControlDict,
  use_cached_results_control: new FormControl<boolean>(true, nonNullable),
  uncertainty_ellipse_control: new FormControl<boolean>(false, nonNullable),
  padding_input_control: new FormControl<number>(0, nonNullable),
  radius_input_control: new FormControl<number>(0, nonNullable),
  start_time_input_control: new FormControl<string>('', nonNullable),
  stop_time_input_control: new FormControl<string>('', nonNullable),
  select_all_sources_control: new FormControl<boolean>(true, nonNullable),
  intersection_type_input_control: new FormControl<TIntersectionType>(
    'ImageIntersectsArea',
    nonNullable
  ),
} as const;

export const controlKeysForGroupForm = Object.keys(formControlDict) as Array<
  keyof typeof formControlDict
>;

export type TControlKeyForGroupForm = (typeof controlKeysForGroupForm)[number];

export const formControlLabels: {
  [K in TControlKeyForGroupForm]: string;
} = {
  // UPPER
  search_field_control: 'Search Field',

  // MIDDLE
  toggle_moving_vs_fixed_control: 'Moving vs Fixed',
  show_advanced_options_control: 'Show Advanced Options',

  // LOWER
  ...controlLabelsDictForSources,
  padding_input_control: 'Padding',
  radius_input_control: 'Radius',
  uncertainty_ellipse_control: 'Uncertainty Ellipse',
  use_cached_results_control: 'Use Cached Results',
  select_all_sources_control: 'Select All Sources',
  start_time_input_control: 'Start Time',
  stop_time_input_control: 'Stop Time',
  intersection_type_input_control: 'Intersection Type',
};
