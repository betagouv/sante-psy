import { Request, Response } from 'express';
import dbUniversities from '../db/universities';
import asyncHelper from '../utils/async-helper';
import config from '../utils/config';

const sort = (a, b) => {
  if (a.name < b.name) { return -1; }
  if (a.name > b.name) { return 1; }
  return 0;
};

const getConfig = async (req: Request, res: Response): Promise<void> => {
  let universities = [];
  universities = await dbUniversities.getUniversities();

  // used to place "-- nothing yet" in first position
  universities.sort(sort);

  res.json({
    appName: config.appName,
    contactEmail: config.contactEmail,
    demarchesSimplifieesUrl: config.demarchesSimplifieesUrl,
    announcement: config.announcement,
    dateOfBirthDeploymentDate: config.dateOfBirthDeploymentDate,
    sessionDuration: config.sessionDurationHours,
    satistics: config.satistics,
    universities,
    // TO REMOVE suspensionDepartment
    suspensionDepartments: config.suspensionDepartment,
  });
};

export default {
  getConfig: asyncHelper(getConfig),
};
