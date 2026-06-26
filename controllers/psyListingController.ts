import { Request, Response } from 'express';
import { query } from 'express-validator';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import { Psychologist, PsychologistFilters } from '../types/Psychologist';
import validation from '../utils/validation';
import { shuffleBasedOnHour } from '../utils/shuffle';
import { getPsyDistanceKm } from '../utils/distance';

const getValidators = [
  query('nameAndSpeciality')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 }),
  query('language').optional().trim().escape().isLength({ min: 1, max: 100 }),
  query('address').optional().trim().escape().isLength({ min: 1, max: 100 }),
  query('coords').optional().trim().escape().isLength({ min: 1, max: 50 }),
  query('teleconsultation').optional().trim().escape().isBoolean(),
];

const cleanValue = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
    .trim()
    .toLowerCase();

const preprocessFilters = (
  filters: PsychologistFilters,
): PsychologistFilters => {
  const processedFilters: PsychologistFilters = {};

  if (filters.nameAndSpeciality) {
    processedFilters.nameAndSpeciality = cleanValue(filters.nameAndSpeciality);
  }
  if (filters.address) {
    processedFilters.address = cleanValue(filters.address);
  }
  if (filters.coords) {
    processedFilters.coords = filters.coords;
  }
  if (filters.language) {
    processedFilters.language = cleanValue(filters.language);
  }
  if (filters.teleconsultation) {
    processedFilters.teleconsultation =
      filters.teleconsultation.toString() === 'true' ? true : undefined;
  }

  return processedFilters;
};

const getAllActive = async (
  req: Request,
  res: Response,
  reduced: boolean,
): Promise<void> => {
  const { filters } = req.query;
  validation.checkErrors(req);
  const rawFilters = filters as PsychologistFilters;

  let psychologistFilters: PsychologistFilters = {};
  if (rawFilters) {
    psychologistFilters = preprocessFilters(rawFilters);
  }
  const filtersForDb = { ...psychologistFilters };
  if (
    (psychologistFilters.address && !psychologistFilters.coords) ||
    psychologistFilters.coords
  ) {
    delete filtersForDb.address;
  }

  const psyList =
    await dbPsychologists.getAllActiveByAvailability(filtersForDb);

  let filteredPsyList = psyList as (Psychologist & {
    distanceToUser?: number;
  })[];

  if (psychologistFilters.teleconsultation) {
    // teleconsultation: return 50 random psys that match text filters
    shuffleBasedOnHour(filteredPsyList);
  } else if (psychologistFilters.coords) {
    // if we have coordinates, return 50 closest psys (max 150km)
    filteredPsyList = filteredPsyList
      .map((psy) => ({
        ...psy,
        distanceToUser: getPsyDistanceKm(psy, psychologistFilters.coords),
      }))
      .filter((psy) => psy.distanceToUser <= 150);
    filteredPsyList.sort(
      (psy1, psy2) => psy1.distanceToUser - psy2.distanceToUser,
    );
  }

  const finalList = reduced
    ? filteredPsyList.map((psy) => ({
        dossierNumber: psy.dossierNumber,
        firstNames: psy.useFirstNames || psy.firstNames,
        lastName: psy.useLastName || psy.lastName,
        teleconsultation: psy.teleconsultation,
        departement: psy.departement,
        region: psy.region,
        address: psy.address,
        longitude: psy.longitude,
        latitude: psy.latitude,
        city: psy.city,
        postcode: psy.postcode,
        otherAddress: psy.otherAddress,
        otherLongitude: psy.otherLongitude,
        otherLatitude: psy.otherLatitude,
        otherCity: psy.otherCity,
        otherPostcode: psy.otherPostcode,
        languages: psy.languages,
        email: psy.email,
        phone: psy.phone,
        description: psy.description,
        ...(psy.distanceToUser ? { distanceToUser: psy.distanceToUser } : {}),
      }))
    : filteredPsyList;

  res.json(finalList.slice(0, 50));
};

export default {
  getValidators,
  getReducedActive: asyncHelper((req, res) => getAllActive(req, res, true)),
  getFullActive: asyncHelper((req, res) => getAllActive(req, res, false)),
};
