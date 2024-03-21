import { IOptionsNumbers } from '../../options';
/**
 * To generate input fields to be placed neatly within the settings panel
 * like so:
 *
    <div class="three-column-container">
      <div class="first-column"> Title Text </div>
      <div class="second-column">
          <input type="text">
      <div>
      <div class="third-column"> BLANK </div>
    <div>
 *
 */
export declare const createTitledInput: (title: string, key: keyof IOptionsNumbers) => HTMLDivElement;
