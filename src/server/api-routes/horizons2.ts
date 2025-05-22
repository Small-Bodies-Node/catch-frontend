import { Request, Response } from 'express';

import * as AWS from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { getInterpolatedEpochs } from '../../utils/getInterpolatedEpochs';
import { urlToFilename } from '../../utils/urlToFilename';

// Load environment variables
dotenv.config();

// Configure the AWS SDK
const s3 = new AWS.S3Client({
  region: process.env['AWS_REGION'] || 'us-east-1',
  credentials: {
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || '',
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'] || '',
  },
});

/**
 *  Ping JPL horizons
 */
export const horizons2 = async (req: Request, res: Response) => {
  // --->

  // Check if the jpl url was included
  console.log('>>> ', req.body);
  const { target, start_jd, end_jd, body_type } = req.body;

  if (!target || typeof target !== 'string') {
    return res.status(400).json({
      error: 'Missing required query parameters: horizons_url are required.',
    });
  }

  if (!start_jd || typeof start_jd !== 'number') {
    return res.status(400).json({
      error: 'Missing required query parameters: start_date are required.',
    });
  }

  if (!end_jd || typeof end_jd !== 'number') {
    return res.status(400).json({
      error: 'Missing required query parameters: end_date are required.',
    });
  }

  if (!body_type || !['comet', 'asteroid'].includes(body_type)) {
    return res.status(400).json({
      error: 'Missing required query parameters: valid body_type is required.',
    });
  }

  const epochsJd = getInterpolatedEpochs(start_jd, end_jd);

  const epochsJdStr = epochsJd.reduce((acc: string, epochJd: number) => {
    acc += `'${epochJd}' `;
    return acc;
  }, '');

  const COMMAND =
    body_type === 'comet'
      ? `DES=${target}%3B CAP%3B NOFRAG%3B`
      : `${target}%3B`;

  const horizons_url =
    `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&` +
    `COMMAND='${COMMAND}'&` +
    `OBJ_DATA='YES'&` +
    `MAKE_EPHEM='YES'&` +
    `OUT_UNITS='AU-D'&` +
    `EPHEM_TYPE='ELEMENTS'&` +
    // `CENTER=10&` +
    `CENTER=@ssb&` +
    `TLIST=${epochsJdStr}`;

  console.log('horizons_url', horizons_url);

  // If file exists, return it:
  const filename = urlToFilename(horizons_url);
  console.log('Checking for file:', filename);
  const cachedUrl = `https://sbn-ddarg-jpl-horizons-cache.s3.amazonaws.com/${filename}`;

  // try {
  //   const cachedResponse = await fetch(cachedUrl, { method: 'GET' });
  //   if (cachedResponse.status === 200) {
  //     const data = await cachedResponse.text();
  //     return res.status(200).send(data || 'No data found');
  //   }
  // } catch (err) {
  //   console.error('Error fetching cached data:', err);
  //   return res
  //     .status(500)
  //     .json({ error: 'An error occurred while fetching data from the API.' });
  // }

  // If file does not exist, fetch it from the API:
  try {
    // console.log('File does not exist; pinging: ', horizons_url);
    const contentHtml = await fetch(horizons_url)
      .then((res2) => res2.text())
      .catch((err) => {
        return undefined;
      });

    if (contentHtml) {
      // Save data to S3 cache
      // console.log(
      //   'Saving file to cache: ',
      //   process.env['S3_BUCKET_NAME'] + '/' + filename
      // );
      try {
        const data = s3.send(
          new AWS.PutObjectCommand({
            Bucket: process.env['S3_BUCKET_NAME']!,
            Key: filename,
            Body: contentHtml, // The HTML content
            ContentType: 'text/html', // MIME type for HTML
            // ACL: 'public-read', // Make the file publicly accessible
          })
        );
        data.then((data2) => console.log('File uploaded successfully:', data2));
      } catch (err: any) {
        return res.status(500).send(`Error uploading file: ${err.message}`);
      }
      // Return data
      return res.status(200).send(contentHtml);
    } else {
      return res.status(400).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error fetching data from the API:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching data from the API.' });
  }
};
