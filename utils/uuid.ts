import { v5 as uuidv5 } from 'uuid';
import config from './config';

const generateUuidFromString = (id: string): string => uuidv5(id, config.uuidNamespace);

const randomUuid = (random = Math.random().toString()): string => generateUuidFromString(random);

export default {
  generateUuidFromString,
  randomUuid,
};
