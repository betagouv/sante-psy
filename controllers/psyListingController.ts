import { Request, Response } from 'express';
import { query } from 'express-validator';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import { PsychologistFilters } from '../types/Psychologist';
import distanceKm from '../services/distance';
import validation from '../utils/validation';
import getAddressCoordinates from '../services/getAddressCoordinates';

const getValidators = [
  query('nameAndSpeciality').optional()
  .trim()
  .escape()
  .isLength({ min: 1, max: 100 }),
  query('language').optional()
  .trim()
  .escape()
  .isLength({ min: 1, max: 100 }),
  query('address').optional()
  .trim()
  .escape()
  .isLength({ min: 1, max: 100 }),
  query('coords').optional()
  .trim()
  .escape()
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

  if (filters.nameAndSpeciality) {
    processedFilters.nameAndSpeciality = cleanValue(filters.nameAndSpeciality);
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
  if (filters.teleconsultation) {
    processedFilters.teleconsultation = filters.teleconsultation.toString() === 'true' ? true : undefined;
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
  if (psychologistFilters.address && !psychologistFilters.coords) {
    delete filtersForDb.address;
  }

  const [veryAvailablePsys, notVeryAvailablePsys] = await Promise.all([
    dbPsychologists.getAllActiveByAvailability(true, filtersForDb),
    dbPsychologists.getAllActiveByAvailability(false, filtersForDb),
  ]);
  const psyList = veryAvailablePsys.concat(notVeryAvailablePsys);

  let filteredPsyList = psyList;

  if (psychologistFilters.coords) {
    const [lat, lon] = psychologistFilters.coords.split(',').map(Number);
    filteredPsyList = psyList
      .filter((psy) => psy.latitude && psy.longitude)
      .filter((psy) => {
        const distance = distanceKm(lat, lon, psy.latitude, psy.longitude);
        return distance <= 20;
      })
      .map((psy) => {
        const distance = distanceKm(lat, lon, psy.latitude, psy.longitude);
        return { ...psy, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  } else if (psychologistFilters.address) {
    let searchCriteria;
    let isStructuredSearch = false;

    // Check if address is a structured JSON object from API
    try {
      const parsed = JSON.parse(psychologistFilters.address);
      if (parsed && typeof parsed === 'object') {
        searchCriteria = parsed;
        isStructuredSearch = true;
      }
    } catch {
      // Fallback to simple text search
      searchCriteria = { searchText: psychologistFilters.address };
    }

    const exactMatches = psyList.filter((psy) => {
      const addressFields = [
        psy.address,
        psy.otherAddress,
        psy.city,
        psy.otherCity,
        psy.postcode,
        psy.otherPostcode,
        psy.departement,
        psy.region,
      ].filter(Boolean);

      if (isStructuredSearch) {
        // Structured search: prioritize exact matches by type
        if (searchCriteria.type === 'municipality') {
          const searchCity = cleanValue(searchCriteria.city || searchCriteria.value);
          const searchPostcode = searchCriteria.postcode;

          // Extract city and postcode from address fields as fallback
          const extractCityFromAddress = (address: string | null): string | null => {
            if (!address) return null;
            // Try to extract city from address (last part after last comma or space before postcode)
            const parts = address.split(/[,]/);
            const lastPart = parts[parts.length - 1]?.trim();
            // Remove postcode pattern (5 digits) to get city name
            return lastPart?.replace(/\d{5}/g, '').trim() || null;
          };

          const extractPostcodeFromAddress = (address: string | null): string | null => {
            if (!address) return null;
            // Extract 5-digit postcode from address
            const match = address.match(/\b(\d{5})\b/);
            return match ? match[1] : null;
          };

          // Collect all possible cities and postcodes
          const psyCities = [
            psy.city,
            psy.otherCity,
            extractCityFromAddress(psy.address),
            extractCityFromAddress(psy.otherAddress),
          ].filter(Boolean);

          const psyPostcodes = [
            psy.postcode,
            psy.otherPostcode,
            extractPostcodeFromAddress(psy.address),
            extractPostcodeFromAddress(psy.otherAddress),
          ].filter(Boolean);

          // Check city name match (exact or starts with to avoid partial matches)
          const cityMatch = psyCities.some((city) => {
            if (!city) return false;
            const cleanPsyCity = cleanValue(city);
            return cleanPsyCity === searchCity || cleanPsyCity.startsWith(`${searchCity} `);
          });

          // If city matches, verify department consistency via postcode prefix
          if (cityMatch && searchPostcode) {
            const searchDept = searchPostcode.substring(0, 2);
            const deptMatch = psyPostcodes.some((code) => code?.startsWith(searchDept));
            return deptMatch;
          }

          return cityMatch;
        }

        if (searchCriteria.type === 'departement') {
          const deptMatch = psy.departement && cleanValue(psy.departement).includes(cleanValue(searchCriteria.value));
          const regionMatch = psy.region && cleanValue(psy.region).includes(cleanValue(searchCriteria.value));
          return deptMatch || regionMatch;
        }

        if (searchCriteria.type === 'region') {
          return psy.region && cleanValue(psy.region).includes(cleanValue(searchCriteria.value));
        }

        if (searchCriteria.postcode) {
          return [psy.postcode, psy.otherPostcode].some((code) => code === searchCriteria.postcode);
        }

        // Fallback: search in all address fields
        return addressFields.some((field) => {
          if (!field) return false;
          const cleanField = cleanValue(field);
          const cleanSearchValue = cleanValue(searchCriteria.value || searchCriteria.label);
          return cleanField.includes(cleanSearchValue);
        });
      }

      // Simple text search
      return addressFields.some((field) => {
        const cleanField = cleanValue(field);
        const cleanSearch = cleanValue(searchCriteria.searchText);

        if (cleanField === cleanSearch) return true;
        if (cleanSearch.length > 3 && cleanField.includes(cleanSearch)) return true;

        return false;
      });
    }).map((psy) => ({ ...psy, distance: null }));

    // If fewer than 10 exact matches, add proximity matches (within 20km)
    if (exactMatches.length < 10) {
      try {
        // For geocoding, use 'value' if structured search, otherwise use raw address
        let addressForGeocoding = psychologistFilters.address;
        if (isStructuredSearch && searchCriteria.value) {
          addressForGeocoding = searchCriteria.value;
        }

        const coordinates = await getAddressCoordinates(addressForGeocoding);
        if (coordinates && coordinates.latitude && coordinates.longitude) {
          const { latitude: lat, longitude: lon } = coordinates;

          const exactMatchIds = new Set(exactMatches.map((psy) => psy.dossierNumber));

          const proximityMatches = psyList
            .filter((psy) => !exactMatchIds.has(psy.dossierNumber))
            .filter((psy) => psy.latitude && psy.longitude)
            .filter((psy) => {
              const distance = distanceKm(lat, lon, psy.latitude, psy.longitude);
              return distance <= 20;
            })
            .map((psy) => {
              const distance = distanceKm(lat, lon, psy.latitude, psy.longitude);
              return { ...psy, distance };
            })
            .sort((a, b) => a.distance - b.distance);

          filteredPsyList = [...exactMatches, ...proximityMatches];
        } else {
          filteredPsyList = exactMatches;
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        filteredPsyList = exactMatches;
      }
    } else {
      filteredPsyList = exactMatches;
    }
  }

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
      description: psy.description,
    }))
    : filteredPsyList);
};

export default {
  getValidators,
  getReducedActive: asyncHelper((req, res) => getAllActive(req, res, true)),
  getFullActive: asyncHelper((req, res) => getAllActive(req, res, false)),
};
