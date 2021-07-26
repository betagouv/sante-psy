/**
 * Output : "55"
 * @param {} departementString ex : '55 - Indre-et-Loire'
 */
const getNumberFromString = (departementString: string): string => {
  if (!departementString) {
    return null;
  }
  // Note : this is not robust. If Demarches Simplifiées changes their format it will break.
  const parts = departementString.split(' - ');
  return parts[0];
};

export default { getNumberFromString };
