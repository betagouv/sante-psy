import { Request, Response } from 'express';
import asyncHelper from '@utils/async-helper';
import config from '@utils/config';

const getConfig = async (req: Request, res: Response): Promise<void> => {
  res.json({
    appName: config.appName,
    contactEmail: config.contactEmail,
    demarchesSimplifieesUrl: config.demarchesSimplifieesUrl,
    announcement: config.announcement,
    dateOfBirthDeploymentDate: config.dateOfBirthDeploymentDate,
    sessionDuration: config.sessionDurationHours,
    satistics: config.satistics,
  });
};

export default {
  getConfig: asyncHelper(getConfig),
};
