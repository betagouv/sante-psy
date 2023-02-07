import React from 'react';
import { Button, ButtonGroup, Icon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import styles from './psyTable.cssmodule.scss';

const NoResultPsyTable = ({ noResult = false, searchAroundMe, searchWithTeleconsultation }) => (
  <div className={classNames(styles.columnBox, 'fr-my-2w')}>
    <div className={styles.personnalInfo}>
      <Icon className={styles.userIcon} name="ri-search-line" size="2x" />
      <div>
        <h6>
          {noResult ? "Aucun résultat n'a été trouvé, veuillez" : 'Peu de résultats ont été trouvés, vous pouvez'}
          {' '}
          élargir votre champ de recherche en recherchant autour de vous ou en téléconsultation.
        </h6>
      </div>
    </div>
    <ButtonGroup className="fr-ml-6w" isInlineFrom="xs" align="flex-start">
      <Button secondary icon="ri-map-pin-line" onClick={searchAroundMe}>Autour de vous</Button>
      <Button secondary icon="ri-computer-line" onClick={searchWithTeleconsultation}>Téléconsultation</Button>
    </ButtonGroup>
  </div>
);
export default NoResultPsyTable;
