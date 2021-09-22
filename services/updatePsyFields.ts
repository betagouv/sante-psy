import { EditablePsychologist, NonEditablePsychologist, Psychologist } from '../types/Psychologist';

export const addFrenchLanguageIfMissing = (languages: string): string => {
  const frenchRegexp = new RegExp(/fran[çc]ais/, 'g');
  const french = 'Français';
  if (!languages || languages.trim().length === 0) {
    return french;
  }
  if (!frenchRegexp.test(languages.toLowerCase())) {
    return `${french}, ${languages}`;
  }
  return languages;
};

export const editablePsyFields = (psy: Psychologist): EditablePsychologist => ({
  email: psy.email,
  phone: psy.phone,
  website: psy.website,
  description: psy.description,
  teleconsultation: psy.teleconsultation,
  languages: addFrenchLanguageIfMissing(psy.languages),
  personalEmail: psy.personalEmail,
  departement: psy.departement,
  region: psy.region,
  address: psy.address,
  longitude: psy.longitude,
  latitude: psy.latitude,
  otherAddress: psy.otherAddress,
  otherLongitude: psy.otherLongitude,
  otherLatitude: psy.otherLatitude,
});

export const nonEditablePsyFields = (psy: Psychologist): NonEditablePsychologist => ({
  firstNames: psy.firstNames,
  lastName: psy.lastName,
  archived: psy.archived,
  state: psy.state,
  training: psy.training,
  adeli: psy.adeli,
  diploma: psy.diploma,
});

export default {
  editablePsyFields,
  nonEditablePsyFields,
  addFrenchLanguageIfMissing,
};
