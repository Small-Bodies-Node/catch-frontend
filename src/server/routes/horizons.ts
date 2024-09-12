import { Request, Response } from 'express';

import * as AWS from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { urlToFilename } from '../utils/url-to-file';

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
export const horizons = async (req: Request, res: Response) => {
  // --->

  // Check if the jpl url was included
  console.log('>>> ', req.body);
  const { horizons_url } = req.body;
  if (!horizons_url || typeof horizons_url !== 'string') {
    return res.status(400).json({
      error: 'Missing required query parameters: horizons_url are required.',
    });
  }

  // If file exists, return it:
  const filename = urlToFilename(horizons_url);
  const cachedUrl = `https://sbn-ddarg-jpl-horizons-cache.s3.amazonaws.com/${filename}`;
  try {
    const cachedResponse = await fetch(cachedUrl, {
      method: 'GET',
    });
    if (cachedResponse.status === 200) {
      const data = await cachedResponse.text();
      return res.status(200).send(data || 'No data found');
    }
  } catch (err) {
    console.error('Error fetching cached data:', err);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching data from the API.' });
  }

  // If file does not exist, fetch it from the API:
  try {
    console.log('File does not exist; pinging: ', horizons_url);
    const contentHtml = await fetch(horizons_url)
      .then((res2) => res2.text())
      .catch((err) => {
        return undefined;
      });

    if (contentHtml) {
      // Save data to S3 cache
      console.log(
        'Saving file to cache: ',
        process.env['S3_BUCKET_NAME'] + '/' + filename
      );
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
        console.log('File uploaded successfully:', data);
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
