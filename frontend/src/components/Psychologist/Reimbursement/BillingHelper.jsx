import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { ButtonGroup } from '@dataesr/react-dsfr';

const BillingHelper = () => (
  <>
    <h3>Les élements à apparaître sur votre facturation</h3>
    <p className="fr-mb-1w" id="student-billing-info">
      Le nom des étudiants est couvert par le secret médical,
      ne le communiquez pas sur la facture.
      Le nombre d&lsquo;étudiant suffit.
    </p>
    <p className="fr-mb-1w" id="tva-billing-info">
      Si le prestataire n’est pas assujetti à la TVA,
      la facture doit comporter la mention «TVA non applicable, art.293 B du CGI »
    </p>
    <p className="fr-mb-1w">
      Un doute sur le modèle de votre facture ?
      Vous pouvez prendre exemple sur ce modèle qui contient tous les éléments requis pour votre remboursement :
    </p>
    <ButtonGroup isInlineFrom="xs" className="fr-my-2w">
      <div className="button-secondary-container">
        <a
          className="fr-btn fr-btn--secondary"
          href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.pdf`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="fr-fi-file-download-line" aria-hidden="true" />
          .pdf
        </a>
      </div>
      <div className="button-secondary-container">
        <a
          className="fr-btn fr-btn--secondary"
          href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.docx`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="fr-fi-file-download-line" aria-hidden="true" />
          Microsoft Word .docx
        </a>
      </div>
      <div className="button-secondary-container">
        <a
          className="fr-btn fr-btn--secondary"
          href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.odt`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="fr-fi-file-download-line" aria-hidden="true" />
          Libre Office .odt
        </a>
      </div>
    </ButtonGroup>
    <h3>Demander de l&lsquo;aide</h3>
    <ButtonGroup isInlineFrom="xs">
      <div className="button-secondary-container">
        <HashLink
          className="fr-btn fr-btn--secondary"
          to="/faq?section=psychologue#remboursement"
          title="Consulter la Foire Aux Questions sur les remboursements"
        >
          Consulter la Foire Aux Questions
        </HashLink>
      </div>
      <div className="button-secondary-container">
        <a
          className="fr-btn fr-btn--secondary"
          href={`${__API__}/static/documents/tutoriel_choruspro_sante-psy-etudiant.pdf`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="fr-fi-file-download-line" aria-hidden="true" />
          Tutoriel Chorus PRO
        </a>
      </div>
    </ButtonGroup>
  </>
);

export default BillingHelper;
