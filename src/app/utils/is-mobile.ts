/**
 * Test for whether to display for cell-phone devices
 * Taken from: https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
 */
export const isMobile = () => {
  // --->

  const isSmall = window.innerWidth < 500;

  // console.log('Mobile result: ', isSmall);

  return isSmall;

  /*
  const result =
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1;

  console.log('Mobile result: ', result);
  return result;
  */
};
