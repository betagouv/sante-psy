import React from 'react';
import { Skiplinks as DSSkiplinks, SkiplinkItem } from '@dataesr/react-dsfr';

const Skiplinks = () => (
  <DSSkiplinks>
    <SkiplinkItem href="#contenu">Contenu</SkiplinkItem>
    <SkiplinkItem href="#header-navigation">Menu</SkiplinkItem>
    <SkiplinkItem href="#footer">Pied de page</SkiplinkItem>
  </DSSkiplinks>
);

export default Skiplinks;
