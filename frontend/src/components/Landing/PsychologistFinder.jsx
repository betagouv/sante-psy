import React, { useState } from 'react';
import { Row, TextInput, Button } from '@dataesr/react-dsfr';

import styles from './psychologistFinder.cssmodule.scss';

const PsychologistFinder = () => {
  const [search, setSearch] = useState('');
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
          Contacter un psychologue partenaire dans n‘importe quel département,
          peu importe votre université d‘origine, par téléphone, par email ou par son site web.
        </div>
        <Row justifyContent="center">
          <div className={styles.input}>
            <TextInput
              placeholder="Recherche par nom, ville, code postal ou région"
              value={search}
              onChange={e => { setSearch(e.target.value); }}
            />
          </div>
          <Button size="sm">Trouver un psychologue</Button>
        </Row>
      </div>
    </div>
  );
};

export default PsychologistFinder;
