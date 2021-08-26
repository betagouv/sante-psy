import { Request, Response } from 'express';
import { check } from 'express-validator';
import DOMPurify from '../services/sanitizer';
import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import getAddrCoordinates from '../services/getAddrCoordinates';
import { Coordinates } from '../types/Coordinates';
import { Knex } from 'knex';

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
  if (!addressFilter) return false;

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

  const teleconsultation = req.body && req.body.teleconsultation;
  const nameFilter = req.body && req.body.nameFilter !== '' ? req.body.nameFilter : undefined;
  const addressFilter = (req.body && req.body.addressFilter && req.body.addressFilter !== '')
    ? req.body.addressFilter : undefined;
  const isAddressFilterDepartment = isDepartment(addressFilter);

  let coordinates : Coordinates = {};
  if (addressFilter && !isAddressFilterDepartment) {
    coordinates = await getAddrCoordinates(req.body.addressFilter);
  }

  const modifyQuery = (queryBuilder: Knex.QueryBuilder) : void => {
    if (teleconsultation) {
      queryBuilder.where('teleconsultation', true);
    }
    if (nameFilter) {
      queryBuilder.where((builder) => builder.whereRaw(
        'LOWER("lastName" || \' \' || "firstNames") LIKE ?', `%${nameFilter.toLowerCase()}%`,
      ).orWhereRaw(
        'LOWER("firstNames" || \' \' || "lastName") LIKE ?', `%${nameFilter.toLowerCase()}%`,
      ));
    }
    if (isDepartment(addressFilter)) {
      queryBuilder.whereRaw('"departement" LIKE ?', `${addressFilter}%`);
    }

    if (coordinates.longitude && coordinates.latitude) {
      // Careful! Human convention is (lat, long) but Cartesian coordinate convention is (long, lat)
      queryBuilder.orderByRaw(
        `point(longitude, latitude) <@> point(${coordinates.longitude}, ${coordinates.latitude})`,
      );
    } else {
      queryBuilder.orderByRaw('RANDOM()');
    }
  };

  const psyList = await dbPsychologists.getAllActive(modifyQuery);

  let result = [];
  if (addressFilter && !isDepartment(addressFilter)) {
    const matchingPsy = psyList.filter((p) => matchFilter(p.address, addressFilter)
    || matchFilter(p.departement, addressFilter)
    || matchFilter(p.region, addressFilter));

    result.push(...matchingPsy);
    result.push(...psyList.filter((p) => !matchingPsy.includes(p)));
  } else {
    result = psyList;
  }

  console.timeEnd(time);

  res.json(reduced
    ? result.map((psy) => ({
      dossierNumber: psy.dossierNumber,
      firstNames: psy.firstNames,
      lastName: psy.lastName,
      teleconsultation: psy.teleconsultation,
      address: psy.address,
      departement: psy.departement,
      region: psy.region,
    }))
    : result);
};

export default {
  getAllValidators,
  getReducedActive: asyncHelper((req, res) => getAllActive(req, res, true)),
  getFullActive: asyncHelper((req, res) => getAllActive(req, res, false)),
};
