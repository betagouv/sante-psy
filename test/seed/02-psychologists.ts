import create from '../helper/create';

import { DossierState } from '../../types/DossierState';
import uuid from '../../utils/uuid';
import universities from '../../utils/universities';
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
    ...mails.map((mail, index) => create.getOnePsy(
      mail, DossierState.accepte, false, uuid.generateFromString(`university-${universities[index + 1]}`),
    )),
    create.getOnePsy('archived@beta.gouv.fr', DossierState.accepte, true),
    create.getOnePsy('empty@beta.gouv.fr', DossierState.accepte, false),
    create.getOnePsy('construction@beta.gouv.fr', DossierState.enConstruction, false),
    create.getOnePsy('refuse@beta.gouv.fr', DossierState.refuse, false),
  ];

  await knex(psychologistsTable).insert(psyList);
  console.log(`inserted ${psyList.length} psychologists to psychologistsTable`);
};
