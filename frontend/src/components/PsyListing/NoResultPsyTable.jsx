import React from 'react';
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
import classNames from 'classnames';
import styles from './psyTable.cssmodule.scss';

const NoResultPsyTable = ({
  noResult = false,
  searchAroundMe,
  searchWithTeleconsultation,
}) => (
  <div className={classNames(styles.columnBox, 'fr-my-2w')}>
    <div className={styles.personnalInfo}>
      <i
        className={`fr-icon-search-line ${styles.userIcon}`}
        style={{ fontSize: '2rem' }}
      />{' '}
      <div>
        <h6>
          {noResult
            ? "Aucun résultat n'a été trouvé, veuillez"
            : 'Peu de résultats ont été trouvés, vous pouvez'}{' '}
          élargir votre champ de recherche en recherchant autour de vous ou en
          téléconsultation.
        </h6>
      </div>
    </div>
    <ButtonsGroup
      className="fr-ml-6w"
      inlineLayoutWhen="always"
      alignment="left"
      buttons={[
        {
          children: 'Autour de vous',
          priority: 'secondary',
          iconId: 'fr-icon-map-pin-2-line',
          iconPosition: 'left',
          onClick: searchAroundMe,
        },
        {
          children: 'Téléconsultation',
          priority: 'secondary',
          iconId: 'fr-icon-computer-line',
          iconPosition: 'left',
          onClick: searchWithTeleconsultation,
        },
      ]}
    />
  </div>
);
export default NoResultPsyTable;
