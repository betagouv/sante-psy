import config from '../utils/config';

const init = (configValues: string): {
  idToField: {[key: string]: string},
  fieldToId: {[key: string]: string},
} => {
  const idToField = {};
  const fieldToId = {};
  JSON.parse(configValues)
      .forEach(([id, field]: string[]) => {
        idToField[id] = field;
        fieldToId[field] = id;
      });
  return { idToField, fieldToId };
};

const champs = init(config.demarchesSimplifiees.champs);
const annotations = init(config.demarchesSimplifiees.annotations);

const getChampsFieldFromId = (id: string) : string => champs.idToField[id];
const getChampsIdFromField = (field: string) : string => champs.fieldToId[field];
const getAnnotationsFieldFromId = (id: string) : string => annotations.idToField[id];
const getAnnotationsIdFromField = (field: string) : string => annotations.fieldToId[field];

export {
  getAnnotationsFieldFromId,
  getAnnotationsIdFromField,
  getChampsFieldFromId,
  getChampsIdFromField,
};
