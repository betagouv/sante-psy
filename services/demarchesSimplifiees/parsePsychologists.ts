import uuid from '../../utils/uuid';
import { getChampsFieldFromId } from '../champsAndAnnotations';
import { DSPsychologist, Psychologist } from '../../types/Psychologist';

const parseTeleconsultation = (inputString: string): boolean => inputString === 'true';

/**
 * transform string "speciality1, speciality2" to array ["speciality1", "speciality2"]
 * as a JSON to store it inside PG
 */
const parseTraining = (inputString: string): string => {
  if (inputString.includes(',')) {
    return JSON.stringify(inputString.split(', '));
  }
  return JSON.stringify([inputString]);
};

const parseDossierMetadata = (dossier: DSPsychologist): Psychologist => {
  const {
    state,
    archived,
    demandeur,
    usager,
    number,
    groupeInstructeur,
    champs,
  } = dossier;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const psy: any = { state, archived };

  psy.dossierNumber = uuid.getUuidDossierNumber(number);

  psy.lastName = demandeur.nom.trim();
  psy.firstNames = demandeur.prenom.trim();

  psy.personalEmail = usager.email.trim();

  psy.region = groupeInstructeur.label;

  const champsToMap = [
    'departement',
    'diploma',
    'adeli',
    'phone',
    'address',
    'email',
    'languages',
    'website',
    'description',
    'teleconsultation',
    'training',
  ];
  champs.forEach((champ) => {
    const field = getChampsFieldFromId(champ.id);
    if (champsToMap.includes(field)) {
      psy[field] = champ.stringValue.trim();
    }
  });
  psy.teleconsultation = parseTeleconsultation(psy.teleconsultation);
  psy.training = parseTraining(psy.training);

  return psy;
};

const parsePsychologists = (psychologists: DSPsychologist[]): Psychologist[] => {
  console.log(`Parsing ${psychologists.length} psychologists from DS API`);

  return psychologists.map((psychologist) => parseDossierMetadata(psychologist));
};

export default parsePsychologists;
