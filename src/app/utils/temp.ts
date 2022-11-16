import { TPermittedTheme } from '../models/ISiteSettings';

/**
 * Function is part of a s***** hack to determine the color preference
 * the user's browser has inferred from OS settings. It relies on the
 * global styles within styles/styles-hack.scss and a crude/5-year-old
 * DOM-manipulation sequence
 *
 */
export const colorPreferenceDeterminator: () => TPermittedTheme = () => {
  // Add temp div to body
  const div = document.createElement('div');
  document.body.appendChild(div);

  // Apply class targeted by global css for color-preference determination
  // THIS MUST BE THE SAME STRING AS CLASS NAME IN STYLES SHEET!
  div.className += ' color-preference-determinator ';

  // Get computed pseudo-element content string
  const beforeContent = window.getComputedStyle(div, '::before').content;
  // console.log('>>>>>', beforeContent, beforeContent === '"light"');

  // Remove temp div
  document.body.removeChild(div);

  // Return result corresponding to prefers-color-scheme
  // We select LIGHT iff user explicitly prefers light
  if (beforeContent.includes('light')) return 'LIGHT-THEME';
  return 'DARK-THEME';
};
