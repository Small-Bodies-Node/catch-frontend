import express, { Request, Response } from 'express';

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
    const response = await fetch(
      'https://catalogs.mast.stsci.edu/api/v0.1/panstarrs/dr2/mean.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          params: {
            ra,
            dec,
            radius,
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
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
