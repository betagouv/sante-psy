import crypto from 'crypto';
import config from './config';

const hash = (logs = ''): string => `hash ${crypto.createHmac('sha256', config.secretLogs)
    .update(logs.toLowerCase())
    .digest('hex')}`;

export default { hash };
