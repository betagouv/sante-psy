import chai from 'chai';
import chaiHttp from 'chai-http';

require('dotenv').config();

chai.use(chaiHttp);
chai.should();

console.log('Done test setup');
