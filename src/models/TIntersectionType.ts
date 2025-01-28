/**
 * Used for the fixed-target search
 */
export const intersectionTypes = [
  'ImageIntersectsArea',
  'ImageContainsArea',
  'AreaContainsImage',
] as const;

export type TIntersectionType = (typeof intersectionTypes)[number];

export const intersectionTypeLabels: {
  [K in TIntersectionType]: string;
} = {
  AreaContainsImage: 'Area Contains Image',
  ImageContainsArea: 'Image Contains Area',
  ImageIntersectsArea: 'Image Intersects Area',
};

export const intersectionTypeDict: {
  [K in TIntersectionType]: string;
} = {
  AreaContainsImage: 'ImageIntersectsArea',
  ImageContainsArea: 'AreaContainsImage',
  ImageIntersectsArea: 'ImageContainsArea',
};
