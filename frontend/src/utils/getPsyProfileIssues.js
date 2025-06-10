const isWebsite = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;

export default function getPsyProfileIssues(psy) {
  const issues = [];

  if (!psy.description || psy.description.length < 50) {
    issues.push('Votre présentation est trop courte.');
  }

  if (psy.website && !isWebsite.test(psy.website)) {
    issues.push('Votre site internet ne semble pas valide.');
  }

  if (psy.appointmentLink && !isWebsite.test(psy.appointmentLink)) {
    issues.push('Votre site internet de prise de rendez-vous ne semble pas valide.');
  }

  if (psy.address && (!psy.longitude || !psy.latitude)) {
    issues.push(`L'adresse ${psy.address} ne semble pas valide.`);
  }

  if (psy.otherAddress && (!psy.otherLongitude || !psy.otherLatitude)) {
    issues.push(`L'adresse ${psy.otherAddress} ne semble pas valide.`);
  }

  return issues;
}
