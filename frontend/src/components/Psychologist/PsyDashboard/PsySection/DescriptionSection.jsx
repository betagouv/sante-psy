import React from 'react';
import { Button } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';

import styles from './psySection.cssmodule.scss';

const DescriptionSection = ({ psychologist }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.psyDashboardDescription}>
      <b>Description : </b>
      <p>{psychologist.description}</p>
      <Button
        secondary
        title="Modify"
        icon="ri-edit-line"
        onClick={() => navigate('/psychologue/modifier-profil', { state: { psychologist } })}
        className={styles.buttonEdit}
    >
        Modifier
      </Button>
    </section>
  );
};

export default DescriptionSection;
