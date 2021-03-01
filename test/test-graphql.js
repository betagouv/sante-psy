require('dotenv').config();
const rewire = require('rewire');

const graphql = rewire('../utils/graphql.js');

describe('GraphQL Handler', () => {
  describe('hasErrors', () => {
    it('should return true if API has returned an error', async () => {
      const errorResponse = {"response":
      {"data":null,
        "errors":[
          {"message":"Couldn't find Procedure with 'id'=3553849 [WHERE \"procedures\".\"hidden_at\" IS NULL]"}
        ]
      }
      };

      const hasErrors = graphql.__get__('hasErrors');
      hasErrors(errorResponse).should.be.true;
    });

    it('should return false if there are no errors', async () => {
      const errorResponse =  {"response":{"data":null,"errors":[]}};

      const hasErrors = graphql.__get__('hasErrors');
      hasErrors(errorResponse).should.be.false;
    });
  });

  describe('getWhereConditionAfterCursor', () => {
    it('should return the graphql condition with after as an argument', async () => {
      const after = "MzA2"
      const result = `, after: "${after}"`;
      const getWhereConditionAfterCursor = graphql.__get__('getWhereConditionAfterCursor');

      getWhereConditionAfterCursor(after).should.equal(result);
    });


    it('should return an empty string if undefined', async () => {
      const getWhereConditionAfterCursor = graphql.__get__('getWhereConditionAfterCursor');

      getWhereConditionAfterCursor(undefined).should.equal('');
    });
  });
});