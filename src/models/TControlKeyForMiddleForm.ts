import { FormControl } from '@angular/forms';

export type TMovingVsFixed = 'moving' | 'fixed';

export const middleFormControlDict = {
  toggle_moving_vs_fixed_control: new FormControl<TMovingVsFixed>('moving'),
  show_advanced_options_control: new FormControl<boolean>(true),
} as const;

export const controlKeysForMiddleForm = Object.keys(
  middleFormControlDict
) as Array<keyof typeof middleFormControlDict>;

export type TControlKeyForMiddleForm =
  (typeof controlKeysForMiddleForm)[number];

export const controlLabelsDictForMiddleForm: {
  [K in TControlKeyForMiddleForm]: string;
} = {
  toggle_moving_vs_fixed_control: 'Moving vs Fixed',
  show_advanced_options_control: 'Show Advanced Options',
};
