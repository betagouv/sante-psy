import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { ButtonGroup } from '@dataesr/react-dsfr';

const BillingHelper = () => (
  <>
    <h3>Les élements à apparaître sur votre facturation</h3>
    <p className="fr-mb-1w">
      Le nom des étudiants est couvert par le secret médical,
      ne le communiquez pas sur la facture.
      Le nombre d&lsquo;étudiant suffit.
    </p>
    <p className="fr-mb-1w">
      Si le prestataire n’est pas assujetti à la TVA,
      la facture doit comporter la mention «TVA non applicable, art.293 B du CGI »
    </p>
    <p className="fr-mb-1w">
      Un doute sur le modèle de votre facture ?
      Vous pouvez prendre exemple sur ce modèle qui contient tous les éléments requis pour votre remboursement :
    </p>
    <ButtonGroup isInlineFrom="xs" className="fr-my-2w">
      <a
        className="fr-btn fr-btn--secondary"
        href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.pdf`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="fr-fi-file-download-line" aria-hidden="true" />
        .pdf
      </a>
      <a
        className="fr-btn fr-btn--secondary"
        href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.docx`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="fr-fi-file-download-line" aria-hidden="true" />
        Microsoft Word .docx
      </a>
      <a
        className="fr-btn fr-btn--secondary"
        href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.odt`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="fr-fi-file-download-line" aria-hidden="true" />
        Libre Office .odt
      </a>
    </ButtonGroup>
    <h3>Demander de l&lsquo;aide</h3>
    <ButtonGroup isInlineFrom="xs">
      <HashLink
        className="fr-btn fr-btn--secondary"
        to="/faq?section=psychologue#remboursement"
      >
        Consulter la Foire Aux Questions
      </HashLink>
      <a
        className="fr-btn fr-btn--secondary"
        href={`${__API__}/static/documents/tutoriel_choruspro_sante-psy-etudiant.pdf`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="fr-fi-file-download-line" aria-hidden="true" />
        Tutoriel Chorus PRO
      </a>
    </ButtonGroup>
  </>
);

export default BillingHelper;