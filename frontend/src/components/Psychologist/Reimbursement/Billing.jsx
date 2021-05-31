import React, { useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';

const Billing = ({ total }) => {
  useEffect(() => {}, []);
  return (
    <div className="fr-mb-3w">
      <h2>Facturation</h2>
      <h3>
        Comment mes séances seront-elles remboursées ?
      </h3>
      <div className="fr-mb-2w">
        <p className="fr-mb-2w">
          À la fin de chaque mois, vous devez envoyer un email à l&lsquo;université de conventionnement,
          contenant une facture des séances réalisées.
          L&lsquo;université se chargera du remboursement, dans les 30 jours après la réception de cette facture.
        </p>
        <p className="fr-mb-1v">
          Besoin de plus d&lsquo;informations ?
        </p>
        <HashLink
          className="fr-btn fr-btn--secondary fr-mt-2w"
          to="/faq#remboursement"
        >
          Consulter la Foire Aux Questions
        </HashLink>
      </div>

      <h3>Les élements à apparaître sur votre facturation</h3>
      {total.length > 0 ? (
        <>
          <p className="fr-mb-2w">
            Le nom des patients est couvert par le secret médical,
            ne le communiquez pas sur la facture.
            Le nombre de patients suffit.
          </p>
          <div className="fr-table fr-mb-2w">
            <table>
              <caption>Tableau récapitulatif par mois</caption>
              <thead>
                <tr>
                  <th scope="col">Mois</th>
                  <th scope="col">Nombre de séances</th>
                  <th scope="col">Nombre de patients</th>
                </tr>
              </thead>
              <tbody>
                {total.map(totalByMonth => (
                  <tr data-test-id="billing-row" key={`${totalByMonth.month} ${totalByMonth.year}`}>
                    <td>{`${totalByMonth.month} ${totalByMonth.year}`}</td>
                    <td>{totalByMonth.countAppointments}</td>
                    <td>{totalByMonth.countPatients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>
            Aide pour la facturation
          </h3>
          <p className="fr-mb-2w">
            Un doute sur le modèle de votre facture ?
            Vous pouvez prendre exemple sur ce modèle qui contient tous les éléments requis pour votre remboursement :
          </p>
          <p className="fr-mb-2w">
            <a
              className="fr-btn fr-btn--secondary fr-mt-2w fr-mr-1w"
              href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.pdf`}
            >
              <span className="fr-fi-file-download-line" aria-hidden="true" />
              .pdf
            </a>
            <a
              className="fr-btn fr-btn--secondary fr-mt-2w fr-mr-1w"
              href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.docx`}
            >
              <span className="fr-fi-file-download-line" aria-hidden="true" />
              Microsoft Word .docx
            </a>
            <a
              className="fr-btn fr-btn--secondary fr-mt-2w fr-mr-1w"
              href={`${__API__}/static/documents/modele-facturation-sante-psy-etudiant.odt`}
            >
              <span className="fr-fi-file-download-line" aria-hidden="true" />
              Libre Office .odt
            </a>
          </p>
        </>
      ) : (
        <p className="fr-mb-2w">
          Vous n&lsquo;avez pas encore déclaré de séances,
          vous retrouverez ici votre récapitulatif de séances dans le but de créer vous même votre facture
        </p>
      )}
    </div>
  );
};

export default Billing;
