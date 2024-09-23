declare type TLabel = 'settings';
interface IIconOptions {
    sizePxls: number;
    color: string;
    isOutlined: boolean;
}
/**
 * Generates simple google icon span of the form:
 *
  <span class="material-icons[-outlined]">
    [label]
  </span>
 *
 */
export declare function createGoogleIcon(label: TLabel, options?: Partial<IIconOptions>): HTMLSpanElement;
export {};
