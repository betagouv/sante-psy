import dotEnv from 'dotenv';

dotEnv.config();

const graphql = require('../utils/graphql');

describe('GraphQL Handler', () => {
  describe('getWhereConditionAfterCursor', () => {
    it('should return the graphql condition with after as an argument', async () => {
      const after = 'MzA2';
      const result = `(after: "${after}")`;
      const getWhereConditionAfterCursor = graphql.__get__('getWhereConditionAfterCursor');

      getWhereConditionAfterCursor(after).should.equal(result);
    });

    it('should return an empty string if undefined', async () => {
      const getWhereConditionAfterCursor = graphql.__get__('getWhereConditionAfterCursor');

      getWhereConditionAfterCursor(undefined).should.equal('');
    });
  });
});
