/**
 * Get the world coordinate system metadata from an image's XMP tags.
 *
 * @param {ExifReader.ExpandedTags} xmp XMP metadata from exif-reader.
 */
export function getWCSfromXMP(xmp: any) {
  // unpack two floating point values from an AVM parameter
  const getTwo = (xmp: any, k: string) => {
    return [Number(xmp[k].value[0].value), Number(xmp[k].value[1].value)];
  };

  const wcs: any = {
    referenceValue: getTwo(xmp, 'Spatial.ReferenceValue'), // world coordinates at referencePixel, degrees
    referencePixel: getTwo(xmp, 'Spatial.ReferencePixel'), // pixel coordinates at referenceValue
    size: [xmp['Image Width'].value, xmp['Image Height'].value], // pixels
  };

  // scale and rotation may be in CDMatrix or Scale+Rotation
  if (xmp['Spatial.CDMatrix'] !== undefined) {
    const cd = [
      [
        Number(xmp['Spatial.CDMatrix'].value[0].value),
        Number(xmp['Spatial.CDMatrix'].value[1].value),
      ],
      [
        Number(xmp['Spatial.CDMatrix'].value[2].value),
        Number(xmp['Spatial.CDMatrix'].value[3].value),
      ],
    ];

    const det = cd[0][0] * cd[1][1] - cd[0][1] * cd[1][0];
    const sign = Math.sign(det);
    const scale = Math.sqrt(Math.abs(det));
    const rot = Math.atan2(
      ((sign * Math.PI) / 180) * cd[0][1],
      ((sign * Math.PI) / 180) * cd[0][0],
    );

    wcs.scale = [-scale, scale]; // degrees / pixel
    wcs.rotation = rot; // radians
  } else {
    wcs.scale = getTwo(xmp, 'Spatial.Scale'); // degrees / pixel
    wcs.rotation = (Math.PI / 180) * Number(xmp['Spatial.Rotation'].value); // radians
  }

  return wcs;
}

/**
 * Angular separation between two points on a sphere.
 *
 * Uses the Vincenty formula for a sphere.
 * Based on astropy.coordinates.angles.utils.angular_separation.
 *
 * @param lon1
 * @param lat1
 * @param lon2
 * @param lat2 The coordinates. [radians]
 *
 * @returns distance [radians]
 */
export function angular_separation(lon1: number, lat1: number, lon2: number, lat2: number) {
  const sdlon = Math.sin(((lon2 - lon1) * Math.PI) / 180);
  const cdlon = Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const slat1 = Math.sin((lat1 * Math.PI) / 180);
  const slat2 = Math.sin((lat2 * Math.PI) / 180);
  const clat1 = Math.cos((lat1 * Math.PI) / 180);
  const clat2 = Math.cos((lat2 * Math.PI) / 180);

  const num1 = clat2 * sdlon;
  const num2 = clat1 * slat2 - slat1 * clat2 * cdlon;
  const denominator = slat1 * slat2 + clat1 * clat2 * cdlon;

  return Math.atan2(Math.hypot(num1, num2), denominator);
}

/**
 * Position angle of two coordinates.
 *
 * Based on astropy.coordinates.angles.utils.position_angle.
 *
 * @param lon1
 * @param lat1
 * @param lon2
 * @param lat2 The coordinates. [radians]
 *
 * @returns The position angle from point 1 to point 2, where the direction
 * towards north is 0, and towards east is pi/2.
 */
export function position_angle(lon1: number, lat1: number, lon2: number, lat2: number) {
  const sdlon = Math.sin(((lon2 - lon1) * Math.PI) / 180);
  const cdlon = Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const slat1 = Math.sin((lat1 * Math.PI) / 180);
  const slat2 = Math.sin((lat2 * Math.PI) / 180);
  const clat1 = Math.cos((lat1 * Math.PI) / 180);
  const clat2 = Math.cos((lat2 * Math.PI) / 180);

  const x = slat2 * clat1 - clat2 * slat1 * cdlon;
  const y = sdlon * clat2;

  return Math.atan2(y, x);
}

/**
 * Convert world coordinates right ascension and declination to pixel position,
 * where (x, y) = (1, 1) is the upper-left corner of the image.
 *
 * @param wcs The world coordinate system transformation parameters (see getWCS).
 * @param ra Right ascension [degrees]
 * @param dec Declination [degrees]
 */
export function world_to_pixel(wcs: any, ra: number, dec: number) {
  // angular distance (rho) to the reference value [degrees]
  const rho =
    (angular_separation(wcs.referenceValue[0], wcs.referenceValue[1], ra, dec) * 180) / Math.PI;

  // position angle (phi) of coordinates with respect to the reference value [radians]
  const phi = position_angle(wcs.referenceValue[0], wcs.referenceValue[1], ra, dec);

  // now, get the pixel coordinates for 1-based index, origin in lower-left
  const x = (rho * Math.sin(phi + wcs.rotation)) / wcs.scale[0] + wcs.referencePixel[0];
  const y = (rho * Math.cos(phi + wcs.rotation)) / wcs.scale[1] + wcs.referencePixel[1];

  // transform to origin in upper-left
  return [x, wcs.size[1] - y + 1];
}

/**
 * Convert an upper-left-origin image pixel position to world coordinates.
 *
 * This is the inverse of world_to_pixel for the local tangent-plane WCS
 * approximation used by the AVM helper above.
 */
export function pixel_to_world(wcs: any, x: number, y: number): [number, number] {
  const lowerLeftY = wcs.size[1] - y + 1;
  const dxDeg = (x - wcs.referencePixel[0]) * wcs.scale[0];
  const dyDeg = (lowerLeftY - wcs.referencePixel[1]) * wcs.scale[1];
  const rhoDeg = Math.hypot(dxDeg, dyDeg);

  if (rhoDeg === 0) {
    return [normalizeDegrees(wcs.referenceValue[0]), wcs.referenceValue[1]];
  }

  const phi = Math.atan2(dxDeg, dyDeg) - wcs.rotation;
  return offset_world_coordinate(wcs.referenceValue[0], wcs.referenceValue[1], rhoDeg, phi);
}

export function offset_world_coordinate(
  ra: number,
  dec: number,
  separationDeg: number,
  positionAngleRad: number,
): [number, number] {
  const lon1 = (ra * Math.PI) / 180;
  const lat1 = (dec * Math.PI) / 180;
  const distance = (separationDeg * Math.PI) / 180;

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const sinDistance = Math.sin(distance);
  const cosDistance = Math.cos(distance);

  const lat2 = Math.asin(
    sinLat1 * cosDistance + cosLat1 * sinDistance * Math.cos(positionAngleRad),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(positionAngleRad) * sinDistance * cosLat1,
      cosDistance - sinLat1 * Math.sin(lat2),
    );

  return [normalizeDegrees((lon2 * 180) / Math.PI), (lat2 * 180) / Math.PI];
}

function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}
