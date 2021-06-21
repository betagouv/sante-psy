const addFrenchLanguageIfMissing = (languages) => {
  const frenchRegexp = new RegExp(/fran[çc]ais/, 'g');
  const french = 'Français';
  if (!languages || languages.trim().length === 0) {
    return french;
  }
  if (!frenchRegexp.test(languages.toLowerCase())) {
    return `${french}, ${languages}`;
  }
  return languages;
};

const editablePsyFields = (psy) => ({
  email: psy.email,
  address: psy.address,
  departement: psy.departement,
  region: psy.region,
  phone: psy.phone,
  website: psy.website,
  description: psy.description,
  teleconsultation: psy.teleconsultation,
  languages: addFrenchLanguageIfMissing(psy.languages),
  personalEmail: psy.personalEmail,
});

const nonEditablePsyFields = (psy) => ({
  firstNames: psy.firstNames,
  lastName: psy.lastName,
  archived: psy.archived,
  state: psy.state,
  training: psy.training,
  adeli: psy.adeli,
  diploma: psy.diploma,
});

module.exports = {
  editablePsyFields,
  nonEditablePsyFields,
  addFrenchLanguageIfMissing,
};
