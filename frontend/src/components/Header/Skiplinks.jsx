import React from 'react';
import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';

const Skiplinks = () => (
  <SkipLinks
    links={[
      { anchor: '#contenu', label: 'Contenu' },
      { anchor: '#header-navigation', label: 'Menu' },
      { anchor: '#footer', label: 'Pied de page' },
    ]}
  />
);

export default Skiplinks;
