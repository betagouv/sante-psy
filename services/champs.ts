import config from '../utils/config';

const idToField = {};
const fieldToId = {};
JSON.parse(config.demarchesSimplifieesChamps)
    .forEach(([id, field]) => {
      idToField[id] = field;
      fieldToId[field] = id;
    });

const getFieldFromId = (id: string) : string => idToField[id];
const getIdFromField = (field: string) : string => fieldToId[field];

export default {
  getFieldFromId,
  getIdFromField,
};
