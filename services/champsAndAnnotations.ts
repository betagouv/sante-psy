import config from '../utils/config';

const init = (configValues) => {
  const idToField = {};
  const fieldToId = {};
  JSON.parse(configValues)
      .forEach(([id, field]) => {
        idToField[id] = field;
        fieldToId[field] = id;
      });
  return { idToField, fieldToId };
};

const champs = init(config.demarchesSimplifieesChamps);
const annotations = init(config.demarchesSimplifieesAnnotations);

const getChampsFieldFromId = (id: string) : string => champs.idToField[id];
const getChampsIdFromField = (field: string) : string => champs.fieldToId[field];
const getAnnotationsFieldFromId = (id: string) : string => annotations.idToField[id];
const getAnnotationsIdFromField = (field: string) : string => annotations.fieldToId[field];

export default {
  getAnnotationsFieldFromId,
  getAnnotationsIdFromField,
  getChampsFieldFromId,
  getChampsIdFromField,
};
