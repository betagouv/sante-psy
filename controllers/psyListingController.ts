import { Request, Response } from 'express';
import { query } from 'express-validator';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import { PsychologistFilters } from '../types/Psychologist';

const getValidators = [
  query('name').optional()
  .trim()
  .escape()
  .isString()
  .isLength({ min: 1, max: 100 }),
  query('language').optional()
  .trim()
  .escape()
  .isString()
  .isLength({ min: 1, max: 100 }),
  query('address').optional()
  .trim()
  .escape()
  .isString()
  .isLength({ min: 1, max: 100 }),
  query('speciality').optional()
  .trim()
  .escape()
  .isString()
  .isLength({ min: 1, max: 100 }),
  query('coords').optional()
  .trim()
  .escape()
  .isString()
  .isLength({ min: 1, max: 50 }),
  query('teleconsultation').optional()
  .trim()
  .escape()
  .isBoolean(),
];

const cleanValue = (value: string): string => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
    .trim()
    .toLowerCase();

const preprocessFilters = (filters: PsychologistFilters): PsychologistFilters => {
  const processedFilters: PsychologistFilters = {};

  if (filters.name) {
    processedFilters.name = cleanValue(filters.name);
  }
  if (filters.address) {
    processedFilters.address = cleanValue(filters.address);
  }
  if (filters.coords) {
    processedFilters.coords = cleanValue(filters.coords);
  }
  if (filters.language) {
    processedFilters.language = cleanValue(filters.language);
  }
  if (filters.speciality) {
    processedFilters.speciality = cleanValue(filters.speciality);
  }
  if (typeof filters.teleconsultation === 'boolean') {
    processedFilters.teleconsultation = filters.teleconsultation ? true : undefined;
  }

  return processedFilters;
};

const getAllActive = async (
  req: Request,
  res: Response,
  reduced: boolean,
): Promise<void> => {
  const { filters } = req.query;
  const rawFilters = filters as PsychologistFilters;

  const psychologistFilters = preprocessFilters(rawFilters);

  const [veryAvailablePsys, notVeryAvailablePsys] = await Promise.all([
    dbPsychologists.getAllActiveByAvailability(true, psychologistFilters),
    dbPsychologists.getAllActiveByAvailability(false, psychologistFilters),
  ]);
  const psyList = veryAvailablePsys.concat(notVeryAvailablePsys);

  /* Apply around me filter */
  const filteredPsyList = psychologistFilters.coords
    ? psyList
      .filter((psy) => {
        const [lat, lon] = psychologistFilters.coords.split(',').map(Number);
        const distance = distanceKm(lat, lon, psy.latitude, psy.longitude);
        return distance <= 10;
      })
      .map((psy) => {
        const [lat, lon] = psychologistFilters.coords.split(',').map(Number);
        const distance = distanceKm(lat, lon, psy.latitude, psy.longitude);
        return { ...psy, distance };
      })
      .sort((a, b) => a.distance - b.distance)
    : psyList;

  res.json(reduced
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
    }))
    : filteredPsyList);
};

export default {
  getValidators,
  getReducedActive: asyncHelper((req, res) => getAllActive(req, res, true)),
  getFullActive: asyncHelper((req, res) => getAllActive(req, res, false)),
};
