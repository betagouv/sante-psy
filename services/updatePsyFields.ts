import { Psychologist, EditablePsychologist, NonEditablePsychologist } from '../@types/santepsy/psychologist';
import { addFrenchLanguageIfMissing } from '../db/psychologists';

const editablePsyFields = (psy: Psychologist) : EditablePsychologist => ({
  email: psy.email,
  address: psy.address,
  departement: psy.departement,
  region: psy.region,
  phone: psy.phone,
  website: psy.website,
  description: psy.description,
  teleconsultation: psy.teleconsultation,
  languages: addFrenchLanguageIfMissing(psy.languages),
  personalEmail: psy.personalEmail,
});

const nonEditablePsyFields = (psy: Psychologist) : NonEditablePsychologist => ({
  firstNames: psy.firstNames,
  lastName: psy.lastName,
  archived: psy.archived,
  state: psy.state,
  training: psy.training,
  adeli: psy.adeli,
  diploma: psy.diploma,
});

export default { editablePsyFields, nonEditablePsyFields };
