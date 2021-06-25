import { Request, Response } from 'express';

import path from 'path';

const getIndex = (req: Request, res: Response): void => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
};

export default getIndex;
