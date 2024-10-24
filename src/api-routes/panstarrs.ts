import express, { Request, Response } from 'express';
import { panstarrsRequestedColumns } from '../utils/panstarrsRequestedColumns';

const panstarrsCache: any = {};

// Clear cache every 24 hours (24 * 60 * 60 * 1000 ms)
setInterval(() => {
  console.log('Clearing panstarrsCache');
  for (const key in panstarrsCache) {
    if (panstarrsCache.hasOwnProperty(key)) {
      delete panstarrsCache[key];
    }
  }
}, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

/**
 *  Ping panstarrs API
 */
export const panstarrs = async (req: Request, res: Response) => {
  const { ra, dec, radius, nDetectionsMin, raDecMaxErr } = req.query;
  if (!ra || !dec || !radius || !nDetectionsMin || !raDecMaxErr) {
    return res.status(400).json({
      error:
        'Missing required query parameters: ra, dec, radius, nDetectionsMin',
    });
  }

  console.log(
    'ra:',
    ra,
    'dec:',
    dec,
    'radius:',
    radius,
    'nDetectionsMin',
    nDetectionsMin,
    'raDecMaxErr:',
    raDecMaxErr
  );

  const cacheKey = `${ra},${dec},${radius},${nDetectionsMin},${raDecMaxErr}`;
  if (panstarrsCache[cacheKey]) {
    console.log('Returning cached data');
    return res.json(panstarrsCache[cacheKey]);
  }

  try {
    const response = await fetch(
      'https://catalogs.mast.stsci.edu/api/v0.1/panstarrs/dr2/mean.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          // Dynamic
          ra,
          dec,
          radius,
          'nDetections.min': nDetectionsMin + '',
          'raMeanErr.max': raDecMaxErr + '',
          // Fixed
          columns: panstarrsRequestedColumns,
          flatten_response: false,
          raw: false,
          sort_by: ['distance'],
          pagesize: 10000,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json().catch((err) => {
        console.log(err);
        throw err;
      });
      panstarrsCache[cacheKey] = data;
      return res.json(data);
    } else {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error('Error fetching data from the API:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching data from the API.' });
  }
};
