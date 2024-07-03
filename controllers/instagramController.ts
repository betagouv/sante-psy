import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import fetchInstagramPosts from '../services/instagram';

const get = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { postsIds } = req.query;
  const eligibility = await fetchInstagramPosts(postsIds);
  res.json(eligibility);
};

export default {
  get: asyncHelper(get),
};
