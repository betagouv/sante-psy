/**
 * get the GraphQL where condition to get another page of information
 * @see https://demarches-simplifiees-graphql.netlify.app/pageinfo.doc.html
 * @param {*} cursor : String
 */
const getWhereConditionAfterCursor = (cursor: string): string => {
  if (cursor) {
    return `(after: "${cursor}")`;
  }
  return '';
};

export default { getWhereConditionAfterCursor };
