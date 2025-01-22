/**
 * Used for the fixed-target search
 */
export const intersectionTypes = [
  'image_intersects_area',
  'image_contains_area',
  'area_contains_image',
] as const;

export type TIntersectionType = (typeof intersectionTypes)[number];

export const intersectionTypeLabels: {
  [K in TIntersectionType]: string;
} = {
  area_contains_image: 'Area Contains Image',
  image_contains_area: 'Image Contains Area',
  image_intersects_area: 'Image Intersects Area',
};

export const intersectionTypeDict: {
  [K in TIntersectionType]: string;
} = {
  image_intersects_area: 'ImageIntersectsArea',
  area_contains_image: 'AreaContainsImage',
  image_contains_area: 'ImageContainsArea',
};
