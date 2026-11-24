import React from 'react';

import Card from 'components/Card/Card';
import styles from './studentCards.cssmodule.scss';
import { fr } from '@codegouvfr/react-dsfr';

const StudentCards = () => (
  <div className={`${fr.cx('fr-grid-row')} ${styles.card}`}>
    <Card
      index={1}
      title="Vérifier votre éligibilité"
      image="eligibility/psychologist.svg"
      buttonIcon="fr-icon-user-search-fill"
      buttonText="Vérifiez votre éligibilité"
      link="/eligibilite"
    />
    <Card
      index={2}
      title="Choisissez un psychologue"
      image="eligibility/followup.svg"
      buttonIcon="fr-icon-search-line"
      buttonText="Trouver un psychologue"
      link="/trouver-un-psychologue"
      anchor="anchor-psy-list"
    />
  </div>
);

export default StudentCards;
