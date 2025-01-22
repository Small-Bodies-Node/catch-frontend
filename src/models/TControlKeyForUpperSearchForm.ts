import { FormControl, Validators } from '@angular/forms';

export const upperFormControlDict = {
  search_field_control: new FormControl<string>('', { nonNullable: true }),
} as const;

export const controlKeysForUpperForm = Object.keys(
  upperFormControlDict
) as Array<keyof typeof upperFormControlDict>;

export type TControlKeyForUpperForm = (typeof controlKeysForUpperForm)[number];

export const controlLabelsDictForUpperForm: {
  [K in TControlKeyForUpperForm]: string;
} = {
  search_field_control: 'Search Field',
};
