const pronouns = {
  ME: {
    subject: 'Vous êtes',
    subjectNegativeBe: "Vous n'êtes",
    subjectNegativeHave: "que vous n'avez",
    possessive: 'votre',
    pronoun: 'vous',
    personalPronoun: 'vous ',
    otherPersonalPronoun: 'vous',
    take: 'Prenez',
    find: 'retrouvez-le',
  },
  CLOSE: {
    subject: 'Votre proche est',
    subjectNegativeBe: "Votre proche n'est",
    subjectNegativeHave: "qu'il n'a",
    possessive: 'son',
    possesiveFem: 'sa',
    pronoun: 'il',
    personalPronoun: "l'",
    otherPersonalPronoun: 'lui',
    take: 'Il peut prendre',
    find: 'il peut le retrouver',
  },
  SCHOOL: {
    subject: 'Vos étudiants sont',
    subjectNegativeBe: 'Vos étudiants ne sont',
    subjectNegativeHave: "que vos étudiants n'ont",
    possessive: 'leur',
    pronoun: 'ils',
    personalPronoun: 'les ',
    otherPersonalPronoun: 'leur',
    take: 'Ils peuvent prendre',
    find: 'ils peuvent le retrouver',
  },
  CONSULTANT: {
    subject: "L'étudiant est",
    subjectNegativeBe: "L'étudiant n'est",
    subjectNegativeHave: "qu'il n'a pas",
    possessive: 'son',
    possesiveFem: 'sa',
    pronoun: 'il',
    personalPronoun: "l'",
    otherPersonalPronoun: 'lui',
    take: 'Il peut prendre',
    find: 'il peut le retrouver',
  },
};

export default pronouns;

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function pluralize(word, whoFor) {
  return whoFor === 'SCHOOL' ? `${word}s` : word;
}
