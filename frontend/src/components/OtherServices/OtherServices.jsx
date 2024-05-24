import React, { useEffect, useState } from 'react';
import Service from './Service';
import styles from './service.cssmodule.scss';

const OtherServices = () => {
  const [small, setSmall] = useState(false);

  useEffect(() => {
    function handleResize() {
      setSmall(window.innerWidth < 769);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
      <div className={styles.services}>
        <Service
          image={small ? '/images/nightline-small.jpg' : '/images/nightline.png'}
          logo="/images/nightline-logo.png"
          name="Nightline"
          title="Par et pour les étudiant.e.s"
          description="Association qui oeuvre pour la santé mentale des étudiants."
          link="https://www.nightline.fr/"
        />
        <Service
          image={small ? '/images/psycom-small.jpg' : '/images/psycom.png'}
          logo="/images/psycom-logo.png"
          name="Le Psycom"
          title="Organisme public d'information sur la santé mentale."
          description="Pour mieux comprendre et mieux se renseigner sur la santé mentale."
          link="https://www.psycom.org/"
        />
        <Service
          image={small ? '/images/3114-small.jpg' : '/images/3114.png'}
          logo="/images/3114-logo.png"
          name="Le 3114"
          title="En détresse ? Témoin d’un proche en souffrance ?"
          description="Des professionnels de santé formés à la prévention du suicide vous écoutent. Ils peuvent proposer des ressources adaptées à vos besoins."
          link="https://3114.fr/"
        />
        <Service
          image={small ? '/images/monparcourspsy-small.jpg' : '/images/monparcourspsy.png'}
          logo="/images/monparcourspsy-logo.png"
          name="MonParcoursPsy"
          title="En parler, c'est déjà se soigner."
          description="Pour tout le monde, à partir de 3 ans. 8 séances par an chez un(e) psychologue"
          link="https://monparcourspsy.sante.gouv.fr/"
        />
      </div>
  );
};

export default OtherServices;
