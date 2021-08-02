import dotEnv from 'dotenv';
import graphql from '../utils/graphql';

dotEnv.config();

describe('GraphQL Handler', () => {
  describe('getWhereConditionAfterCursor', () => {
    it('should return the graphql condition with after as an argument', async () => {
      const after = 'MzA2';
      const result = `(after: "${after}")`;

      graphql.getWhereConditionAfterCursor(after).should.equal(result);
    });

    it('should return an empty string if undefined', async () => {
      graphql.getWhereConditionAfterCursor(undefined).should.equal('');
    });
  });
});
