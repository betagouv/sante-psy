import React from 'react';
import { Highlight, Button } from '@dataesr/react-dsfr';

const PatientActionsLegend = () => (
  <Highlight className="fr-unhidden fr-hidden-md">
    <Button
      disabled
      size="sm"
      icon="ri-calendar-line"
      className="fr-mb-1w fr-mr-1w"
    />
    Déclarer une séance
    <br />
    <Button
      secondary
      disabled
      size="sm"
      icon="ri-edit-line"
      className="fr-mb-1w fr-mr-1w"
    />
    Modifier
    <br />
    <Button
      secondary
      disabled
      size="sm"
      icon="ri-delete-bin-line"
      className="fr-mb-1w fr-mr-1w"
    />
    Supprimer
  </Highlight>
);

export default PatientActionsLegend;
