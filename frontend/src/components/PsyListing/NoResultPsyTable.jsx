import React from 'react';
import { Text } from '@dataesr/react-dsfr';

const NoResultPsyTable = ({ noResultAction }) => (
  <Text size="lg">
    Aucun résultat n&lsquo;a été trouvé, veuillez élargir votre champ de recherche ou
    <button
      type="button"
      onClick={noResultAction}
      className="fr-link fr-link--lg fr-fi-arrow-right-line fr-link--icon-left"
    >
      rechercher autour de vous
    </button>
  </Text>
);
export default NoResultPsyTable;
