import { Request, Response } from 'express';
import { check } from 'express-validator';
import DOMPurify from '../services/sanitizer';
import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import getAddrCoordinates from '../services/getAddrCoordinates';
import { Coordinates } from '../types/Coordinates';

const getAllValidators = [
  check('nameFilter')
    .trim()
    .customSanitizer(DOMPurify.sanitize)
    .isString()
    .withMessage('La recherche par nom est invalide.'),
  check('addressFilter')
    .trim()
    .customSanitizer(DOMPurify.sanitize)
    .isString()
    .withMessage('La recherche par adresse est invalide'),
  check('teleconsultation').toBoolean(),
];

const isDepartment = (addressFilter: string) : boolean => {
  const departementFilter = +addressFilter;
  return departementFilter
  && (
    (departementFilter > 0 && departementFilter < 96)
  || (departementFilter > 970 && departementFilter < 977)
  );
};

const matchFilter = (value: string, filter: string) : boolean => value
&& value.toLowerCase().includes(filter.toLowerCase());

const getAllActive = async (req: Request, res: Response, reduced: boolean): Promise<void> => {
  validation.checkErrors(req);

  const time = `getting all active psychologists from Postgres (query id #${Math.random().toString()})`;
  console.time(time);

  let coordinates : Coordinates = {};
  if (req.body && req.body.addressFilter && req.body.addressFilter !== '' && !isDepartment(req.body.addressFilter)) {
    coordinates = await getAddrCoordinates(req.body.addressFilter);
  }

  const modifyQuery = (queryBuilder) : void => {
    if (req.body && req.body.teleconsultation === true) {
      queryBuilder.where('teleconsultation', true);
    }
    if (req.body && req.body.nameFilter !== '') {
      queryBuilder.whereRaw(
        'LOWER("lastName" || "firstNames") LIKE ?', `%${req.body.nameFilter.replace(/\s/g, '').toLowerCase()}%`,
      );
    }
    if (req.body && req.body.addressFilter && req.body.addressFilter !== '' && isDepartment(req.body.addressFilter)) {
      queryBuilder.whereRaw('"departement" LIKE ?', `${req.body.addressFilter}%`);
    }
  };

  const psyList = await dbPsychologists.getAllActive(modifyQuery, coordinates);

  let returnedPsyList = [];
  if (req.body && req.body.addressFilter && req.body.addressFilter !== '' && !isDepartment(req.body.addressFilter)) {
    const matchingPsy = psyList.filter((p) => matchFilter(p.address, req.body.addressFilter)
    || matchFilter(p.departement, req.body.addressFilter)
    || matchFilter(p.region, req.body.addressFilter));

    returnedPsyList.push(...matchingPsy);
    returnedPsyList.push(...psyList.filter((p) => !matchingPsy.includes(p)));
  } else {
    returnedPsyList = psyList;
  }

  console.timeEnd(time);

  res.json(reduced
    ? returnedPsyList.map((psy) => ({
      dossierNumber: psy.dossierNumber,
      firstNames: psy.firstNames,
      lastName: psy.lastName,
      teleconsultation: psy.teleconsultation,
      address: psy.address,
      departement: psy.departement,
      region: psy.region,
    }))
    : returnedPsyList);
};

export default {
  getAllValidators,
  getReducedActive: asyncHelper((req, res) => getAllActive(req, res, true)),
  getFullActive: asyncHelper((req, res) => getAllActive(req, res, false)),
};
