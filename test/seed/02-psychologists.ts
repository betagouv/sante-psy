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
  'xavier.desoindre@beta.gouv.fr',
  'sandrine.ricardo@beta.gouv.fr',
  'paul.burgun@beta.gouv.fr',
  'lina.cham@beta.gouv.fr',
  'kevin.njock@beta.gouv.fr',
  'vikie.ache@beta.gouv.fr',
  'samy.tolba@beta.gouv.fr',
  'anais.altun@beta.gouv.fr',
  'donia.benharara@beta.gouv.fr',
  'lorraine.tosi@beta.gouv.fr',
  'cyrielle.francais@beta.gouv.fr',
];

export const seed = async (knex: Knex): Promise<void> => {
  const psyList = [
    ...mails.map((mail, index) => create.getOnePsy(
      {
        personalEmail: mail,
        assignedUniversityId: uuid.generateFromString(`university-${universities[index + 1]}`),
        createdAt: new Date('2023-01-01T00:00:00Z'),
      },
    )),
    create.getOnePsy({ personalEmail: 'archived@beta.gouv.fr', archived: true }),
    create.getOnePsy({ personalEmail: 'empty@beta.gouv.fr' }),
    create.getOnePsy({ personalEmail: 'construction@beta.gouv.fr', state: DossierState.enConstruction }),
    create.getOnePsy({ personalEmail: 'refuse@beta.gouv.fr', state: DossierState.refuse }),
  ];

  await knex(psychologistsTable).insert(psyList);
  console.log(`inserted ${psyList.length} psychologists to psychologistsTable`);
};
