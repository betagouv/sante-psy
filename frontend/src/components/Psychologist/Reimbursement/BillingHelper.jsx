import React from 'react';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

const buttons = [
  {
    label: 'PDF .pdf',
    link: `${__API__}/static/documents/modele-facturation-sante-psy-etudiant-50.pdf`,
  },
  {
    label: 'Microsoft Word .docx',
    link: `${__API__}/static/documents/modele-facturation-sante-psy-etudiant-50.docx`,
  },
  {
    label: 'Libre Office .odt',
    link: `${__API__}/static/documents/modele-facturation-sante-psy-etudiant-50.odt`,
  },
];
const BillingHelper = () => (
  <>
    <h3>Les élements à apparaître sur votre facturation</h3>
    <p className="fr-mb-1w" id="student-billing-info">
      Le nom des étudiants est couvert par le secret médical, ne le communiquez
      pas sur la facture. Le nombre d&lsquo;étudiant suffit.
    </p>
    <p className="fr-mb-1w" id="tva-billing-info">
      « TVA non applicable selon l’article 261-4-1 du Code Général des Impôts »
    </p>
    <p className="fr-mb-1w">
      Un doute sur le modèle de votre facture ? Vous pouvez prendre exemple sur
      ces modèles qui contiennent tous les éléments requis pour votre
      remboursement.
    </p>
    <p>Modèles pour les séances :</p>

    <ButtonsGroup
      inlineLayoutWhen="md and up"
      buttons={buttons.map((b) => ({
        priority: 'secondary',
        linkProps: {
          to: b.link,
          target: '_blank',
          rel: 'noreferrer',
        },
        iconId: 'fr-icon-file-download-line',
        children: b.label,
      }))}
    />

    <h3>Demander de l&lsquo;aide</h3>

    <ButtonsGroup
      inlineLayoutWhen="sm and up"
      buttons={[
        {
          priority: 'secondary',
          children: 'Consulter la Foire Aux Questions',
          linkProps: {
            to: '/faq?section=psychologue#remboursement',
          },
        },
        {
          priority: 'secondary',
          children: 'Tutoriel Chorus PRO',
          linkProps: {
            to: `${__API__}/static/documents/tutoriel_choruspro_sante-psy-etudiant.pdf`,
            target: '_blank',
            rel: 'noreferrer',
          },
        },
      ]}
    />
  </>
);

export default BillingHelper;
