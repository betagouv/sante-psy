import demarchesSimplifiees from '../utils/demarchesSimplifiees';
// import graphql from '../utils/graphql';

const ds = async () => {
  /* const instructors = await graphql.getInstructors(46776);
  const instructors = await graphql.getInstructors(56696);
  instructors.groupeInstructeur.instructeurs.forEach((x) => console.log(x));
  */
  await demarchesSimplifiees.autoAcceptPsychologist();
  // fs.writeFileSync('psy.json', JSON.stringify(dsAPIData));
};

console.debug = () => {};

ds();
