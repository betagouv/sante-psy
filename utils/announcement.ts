/* eslint-disable no-bitwise */
import { Request } from 'express';
import config from './config';

// Code from https://stackoverflow.com/a/7616484
const hashCode = (str: string): number => {
  if (!str) {
    return 0;
  }

  let hash = 0; let i; let
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const getAnnouncement = (req: Request) => {
  if (req.cookies.hiddenAnnouncement === hashCode(config.announcement).toString()) {
    return {
      announcement: undefined,
      announcementHash: undefined,
    };
  }

  return {
    announcement: config.announcement,
    announcementHash: hashCode(config.announcement),
  };
};

export default getAnnouncement;
