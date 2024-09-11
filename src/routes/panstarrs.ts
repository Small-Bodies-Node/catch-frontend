import express, { Request, Response } from 'express';
import axios from 'axios';

/**
 *  Ping panstarrs API
 */
export const panstarrs = async (req: Request, res: Response) => {
  const { ra, dec, radius } = req.query;
  if (!ra || !dec || !radius) {
    return res.status(400).json({
      error:
        'Missing required query parameters: ra, dec, and radius are required.',
    });
  }

  console.log('ra:', ra, 'dec:', dec, 'radius:', radius);

  try {
    const response = await axios.post(
      'https://catalogs.mast.stsci.edu/api/v0.1/panstarrs/dr2/mean.json',
      {
        params: {
          ra,
          dec,
          radius,
        },
      }
    );
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from the API:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching data from the API.' });
  }
};
