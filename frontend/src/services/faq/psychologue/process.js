/* eslint-disable no-multi-str */
/* eslint-disable max-len */
module.exports = config => [
  {
    question: 'Je suis déjà des étudiants. Puis-je continuer à les suivre dans le cadre du dispositif Santé Psy Étudiant\u00A0?',
    answer: `Si les étudiants que vous prenez en charge actuellement souhaitent bénéficier du dispositif et \
    poursuivre leur consultation avec vous, il est nécessaire qu’ils soient orientés vers un psychologue par le SSU dont \
    ils dépendent ou un médecin généraliste. Parallèlement, pour pouvoir continuer à suivre ces étudiants, \
    vous devez être agréé pour participer au dispositif\u00A0: renseignez le formulaire en ligne <a href="${config.demarchesSimplifieesUrl}" target="_blank" rel="noopener noreferrer">(cliquez ici pour accéder au formulaire)</a>. \
    Si vous remplissez les conditions de participation et acceptez les modalités de prise en charge des étudiants (tarif, lien avec le corps médical notamment), \
    une convention avec l’université la plus proche de votre lieu d’exercice vous sera proposée et vous serez inscrit sur la liste des psychologues agréés par le SSU \
    mise à disposition des étudiants et médecins généralistes.`,
  },
  {
    question: 'Les étudiants peuvent-ils directement venir voir le psychologue\u00A0?',
    answer: 'Dans le cadre du dispositif Santé Psy Étudiant, les étudiants doivent consulter le service de santé universitaire ou \
    un médecin généraliste qui peut les orienter vers un psychologue partenaire de la démarche.',
  },
  {
    question: 'Comment un étudiant sait s’il a un SSU\u00A0? Comment fait-il s’il n’en a pas\u00A0?',
    answer: 'Les étudiants peuvent savoir si leur établissement dispose d’un service de santé universitaire (SSU) ou s’ils ont accès au SSU \
    d’un autre établissement (par convention) en consultant le site de leur université\u00A0/ école ou en leur téléphonant. \
    Si l’étudiant n’a pas accès à un SSU, il peut se rendre chez un médecin généraliste qui l’orientera en cas de besoin vers un psychologue partenaire du dispositif.\
    D’une façon générale, les établissements disposant d’un SSU sont invités à ouvrir autant que possible leur service aux écoles partenaires ou partageant le site.',
  },
  {
    question: 'Il est indiqué que les psychologues feront acte de candidature via un formulaire simplifié en ligne et \
    qu’une plateforme numérique permettra de déclarer le nombre de consultations effectuées. Serait-il possible d’y avoir accès ou bien est-ce réservé aux SSU\u00A0?',
    answer: 'C’est au psychologue de faire la déclaration des séances faites une fois qu’il est inscrit via le formulaire en ligne et \
    que son dossier est accepté.  Cette déclaration se fait sur la plateforme Santé Psy Étudiant, dans l’espace personnel du psychologue une fois le dossier accepté.',
  },
  {
    question: "Je reçois beaucoup de demande d'étudiants, je souhaite ne plus être affiché dans la liste publique des psychologues partenaires, \
    tout en restant dans le dispositif, est-ce possible\u00A0?",
    answer: 'Vous avez la possibilité de vous inscrire sur la plateforme et ainsi faire bénéficier les étudiants de séances dans le cadre du dispositif. \
    Dans le cas d’une forte demande des étudiants, vous avez la possibilité de refuser par manque de disponibilités lorsqu’un étudiant vous contacte ou éventuellement de l’orienter vers un autre psychologue du dispositif.',
  },
];
