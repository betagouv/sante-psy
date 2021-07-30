import chai from 'chai';
import chaiHttp from 'chai-http';

import dotEnv from 'dotenv';

dotEnv.config();

chai.use(chaiHttp);
chai.should();

console.log('Done test setup');
