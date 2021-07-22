import { v5 as uuidv5 } from 'uuid';
import config from './config';

const generateFromString = (id: string): string => uuidv5(id, config.uuidNamespace);

const generateRandom = (random = Math.random().toString()): string => generateFromString(random);

export default {
  generateFromString,
  generateRandom,
};
