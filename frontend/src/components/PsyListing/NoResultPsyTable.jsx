import React from 'react';
import { Alert } from '@dataesr/react-dsfr';

const NoResultPsyTable = ({ noResult = false, searchAroundMe, searchWithTeleconsultation }) => (
  <Alert
    title=""
    description={(
      <>
        {noResult ? "Aucun résultat n'a été trouvé, veuillez" : 'Peu de résultats ont été trouvés, vous pouvez'}
        {' '}
        élargir votre champ de recherche en recherchant
        {' '}
        <button
          type="button"
          onClick={searchAroundMe}
          className="fr-link fr-fi-arrow-right-line fr-link--icon-left"
        >
          autour de vous
        </button>
        {' '}
        ou
        {' '}
        <button
          type="button"
          onClick={searchWithTeleconsultation}
          className="fr-link fr-fi-arrow-right-line fr-link--icon-left"
        >
          en téléconsultation
        </button>
      </>
    )}
  />
);
export default NoResultPsyTable;
