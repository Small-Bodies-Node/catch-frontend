import express, { Request, Response } from 'express';
import axios from 'axios';

/**
 *
 */
export const hello = async (req: Request, res: Response) => {
  res.send('Hello World from API!!!');
};
