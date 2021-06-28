import clean from '../helper/clean';

import { DOSSIER_STATE } from '../../utils/dossierState';
import { generateUuidFromString } from '../../utils/uuid';
import {
  psychologistsTable,
} from '../../db/tables';
import { Knex } from 'knex';

export const mails = [
  'login@beta.gouv.fr',
  'estelle.comment@beta.gouv.fr',
  'emeline.merliere@beta.gouv.fr',
  'paul.leclercq@beta.gouv.fr',
  'julien.dauphant@beta.gouv.fr',
  'xavier.desoindre@beta.gouv.fr',
  'sandrine.ricardo@beta.gouv.fr',
  'christophe.mamfoumbiphalente@beta.gouv.fr',
  'damir.sagadbekov@beta.gouv.fr',
  'paul.burgun@beta.gouv.fr',
  'lina.cham@beta.gouv.fr',
];

export const seed = async (knex: Knex): Promise<void> => {
  const psyList = [
    ...mails.map((mail) => clean.getOnePsy(
      mail, DOSSIER_STATE.accepte, false, generateUuidFromString('university-Dijon'),
    )),
    clean.getOnePsy('archived@beta.gouv.fr', DOSSIER_STATE.accepte, true),
    clean.getOnePsy('empty@beta.gouv.fr', DOSSIER_STATE.accepte, false),
    clean.getOnePsy('construction@beta.gouv.fr', DOSSIER_STATE.en_construction, false),
    clean.getOnePsy('refuse@beta.gouv.fr', DOSSIER_STATE.refuse, false),
  ];

  await knex(psychologistsTable).insert(psyList);
  console.log(`inserted ${psyList.length} psychologists to psychologistsTable`);
};
