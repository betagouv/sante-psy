import React from 'react';
import { Highlight, Button } from '@dataesr/react-dsfr';

const PatientActionsLegend = () => (
  <Highlight className="fr-displayed-xs fr-hidden-md">
    <Button
      disabled
      size="sm"
      className="fr-fi-calendar-line fr-mb-1w fr-mr-1w"
    />
    Déclarer une séance
    <br />
    <Button
      secondary
      disabled
      size="sm"
      className="fr-fi-edit-line fr-mb-1w fr-mr-1w"
    />
    Modifier
    <br />
    <Button
      secondary
      disabled
      size="sm"
      className="fr-fi-delete-line fr-mb-1w fr-mr-1w"
    />
    Supprimer
  </Highlight>
);

export default PatientActionsLegend;
