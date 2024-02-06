import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import config from '../utils/config';

const get = async (req: Request, res: Response): Promise<void> => {
  res.json({
    appName: config.appName,
    contactEmail: config.contactEmail,
    demarchesSimplifieesUrl: config.demarchesSimplifiees.url,
    announcement: config.announcement,
    publicAnnouncement: config.publicAnnouncement,
    dateOfBirthDeploymentDate: config.dateOfBirthDeploymentDate,
    sessionDuration: config.sessionDurationHours,
    statistics: config.statistics,
  });
};

export default {
  get: asyncHelper(get),
};
