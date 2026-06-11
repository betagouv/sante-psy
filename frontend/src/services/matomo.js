import { AROUND_ME } from 'components/PsyListing/PsyListing';

export const trackSearchPsychologists = (
  nameAndSpecialityFilter,
  languageFilter,
  addressFilter,
  addressFilterObject,
  teleconsultation,
) => {
  const usedFilters = [];

  console.log('hello', nameAndSpecialityFilter);
  if (nameAndSpecialityFilter && nameAndSpecialityFilter.trim()) {
    _paq.push([
      'trackEvent',
      'AnnuairePsy',
      'SpecialitySearch',
      nameAndSpecialityFilter.trim(),
    ]);
    usedFilters.push('speciality');
  }

  if (languageFilter && languageFilter.trim()) {
    _paq.push([
      'trackEvent',
      'AnnuairePsy',
      'LanguageSearch',
      languageFilter.trim(),
    ]);
    usedFilters.push('language');
  }

  if (addressFilterObject && addressFilterObject.label) {
    _paq.push([
      'trackEvent',
      'AnnuairePsy',
      'LocationSearch',
      addressFilterObject.label,
    ]);
    usedFilters.push('location');
  } else if (addressFilter === AROUND_ME) {
    _paq.push([
      'trackEvent',
      'AnnuairePsy',
      'LocationSearch',
      'Géolocalisation',
    ]);
    usedFilters.push('location');
  }

  _paq.push([
    'trackEvent',
    'AnnuairePsy',
    'TeleconsultationFilter',
    teleconsultation ? 'enabled' : 'disabled',
  ]);
  if (teleconsultation) {
    usedFilters.push('teleconsultation');
  }

  if (usedFilters.length > 0) {
    _paq.push([
      'trackEvent',
      'AnnuairePsy',
      'SearchProfile',
      usedFilters.sort().join('+'),
    ]);
  }
};
