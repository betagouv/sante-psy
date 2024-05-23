import React, { useState } from 'react';
import { observer } from 'mobx-react';
import StepBanner from './StepBanner';
import styles from './studentEligibilityStepTwo.cssmodule.scss';
import { Button, Icon } from '@dataesr/react-dsfr';

const StudentEligibilityStepTwo = ({handleNextStep}) => {


  return (
    <section aria-labelledby="step-banner-title">
      <StepBanner number={2} text="Consulter un médecin généraliste" buttonIcon="ri-calendar-2-line" buttonText="Prendre rendez-vous" buttonLink="https://www.doctolib.fr"/>
      <div className={styles.container}>
        <div className={styles.image}>
          <img src="images/sign-document.png" alt="Illustration d'un document signé" />
        </div>
        
        <div>
          <h2>Je demande une <b>lettre d’orientation à qui ?</b></h2>
          <p>
            Chez mon médecin traitant, chez un autre médecin, <br/>
            en visio, au Service de Santé Étudiante (SSE) de mon Université ...
          </p>
          <h3>Que dois figurer sur la lettre ?</h3>
          <p>
            Mention de 8 séances avec le dispositif Santé Psy Étudiant 
          </p>
        </div>
        <div>
          <Button
            onClick={handleNextStep}
          >
            Étape suivante
            <Icon name="ri-arrow-right-s-fill" />
          </Button>
        </div>
        
      </div>
    </section>
  );
};

export default observer(StudentEligibilityStepTwo);
