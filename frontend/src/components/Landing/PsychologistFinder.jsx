import React from 'react';
import { useHistory } from 'react-router-dom';
import { SearchBar } from '@dataesr/react-dsfr';

import styles from './psychologistFinder.cssmodule.scss';

const PsychologistFinder = () => {
  const history = useHistory();
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src="/images/illustration_sante_psy.png"
        alt="Trouver un psychologue"
      />
      <div className={styles.content}>
        <div className={styles.title}>Trouver un psychologue</div>
        <div className={styles.description}>
          Je contacte un psychologue partenaire quel que soit son département et
          mon université d‘origine, par téléphone, par email ou par son site web.
        </div>
        <SearchBar
          label=""
          size="lg"
          buttonLabel="Trouver un psychologue"
          placeholder="Recherche par nom, ville, code postal ou région"
          onSearch={search => { history.push(`/trouver-un-psychologue?search=${search}`); }}
        />
      </div>
    </div>
  );
};

export default PsychologistFinder;
