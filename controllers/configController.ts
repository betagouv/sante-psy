import { Request, Response } from 'express';

import config from '../utils/config';

function getConfig(req: Request, res: Response): void {
  res.json({
    appName: config.appName,
    contactEmail: config.contactEmail,
    demarchesSimplifieesUrl: config.demarchesSimplifieesUrl,
    announcement: config.announcement,
    dateOfBirthDeploymentDate: config.dateOfBirthDeploymentDate,
    sessionDuration: config.sessionDurationHours,
  });
}

export default {
  getConfig,
};
