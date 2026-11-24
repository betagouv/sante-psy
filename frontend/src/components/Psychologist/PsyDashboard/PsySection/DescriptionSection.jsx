import React from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { useNavigate } from 'react-router-dom';

import styles from './psySection.cssmodule.scss';

const DescriptionSection = ({ psychologist }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.psyDashboardDescription}>
      <b>Description : </b>
      <p>{psychologist.description}</p>
      <Button
        priority="secondary"
        iconId="fr-icon-edit-line"
        onClick={() =>
          navigate('/psychologue/modifier-profil', { state: { psychologist } })
        }
        className={styles.buttonEdit}
      >
        Modifier
      </Button>
    </section>
  );
};

export default DescriptionSection;
