import { IOptionsBooleans } from '../../options';
/**
 * Function to create a binary switch with text for the two different states
 * and a callback used to set local-storage options
 * This switch is intended for the settings panel; you create it with the
 * text for the title of the switch (goes on left) and for the two different states.
 * The callback will be used to change the state of options
 */
export declare const createTitledSwitch: (title: string, onText: string, offText: string, key: keyof IOptionsBooleans, cb?: (_isChecked: boolean) => void) => HTMLDivElement;
