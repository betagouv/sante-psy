import fs from 'fs';
// This file can be downloaded here: 
// eslint-disable-next-line max-len
// https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-principaux-etablissements-enseignement-superieur/export/?disjunctive.type_d_etablissement&disjunctive.typologie_d_universites_et_assimiles
import completeInstitutions from './completeInstitutions.json';

fs.writeFileSync('institutionsName.json', JSON.stringify(
  completeInstitutions
  .flatMap((institution) => [institution.fields.uo_lib_officiel, institution.fields.nom_court])
  .filter((institution) => institution),
));
