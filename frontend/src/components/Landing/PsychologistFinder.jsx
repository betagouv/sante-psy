import React from 'react';
import { useTheme } from '@dataesr/react-dsfr';

import styles from './psychologistFinder.cssmodule.scss';
import Section from './Section';

const PsychologistFinder = () => {
  const theme = useTheme();
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={`/images/illustration_sante_psy${theme === 'dark' ? '_dm' : ''}.png`}
        alt="Trouver un psychologue"
      />
      <div className={styles.content}>
        <Section
          title="Trouver un psychologue"
          description="Je contacte un psychologue partenaire dans n&lsquo;importe quel département,
          peu importe mon école ou mon université d&lsquo;origine par téléphone,
          email ou par son site web."
          buttonText="Accéder à l&lsquo;annuaire des psychologues"
          buttonUrl="/trouver-un-psychologue"
        />
      </div>
    </div>
  );
};

export default PsychologistFinder;
