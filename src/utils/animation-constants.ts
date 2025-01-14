/**
 * We place all parameters controlling site's main animations
 * in this centralized location in order to coordinate them easily
 */

export let winWidth = 500;
export let winHeight = 500;

try {
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  window.addEventListener('resize', () => {
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
  });
} catch (err) {
  console.log('Nope: window aint here');
}

/**
 * Time between start of each swipe left/right animation for each image
 * comprising the background scene (mountains, telescope, ground)
 */
export const backgroundSwipeIntervalMs = 300;

/**
 * Duration of each swipe left/right animation for each image
 * comprising the background scene (mountains, telescope, ground)
 *
 * We make the duration proportional to screen size to maintain constant
 * swiping speed
 */
export const backgroundSwipeDurationMs = winWidth;

/**
 * We delay animating in the footer by different amounts
 * depending on whether our navigation has to wait for the
 * home-page swipe animations to complete
 */
export const footerAnimationToFromHomePageDelayMs = 1500;
export const footerAnimationNotToFromHomePageDelayMs = 500;

/**
 * Controls for the routed-page-fade-in animations
 */
export const defaultPageAnimationDelayMs = 200;
export const toHomePageAnimationDelayMs = 1900;
export const fromHomePageAnimationDelayMs = 1500;
export const pageFadeDurationMs = 200;
