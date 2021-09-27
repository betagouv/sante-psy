import React from 'react';
import { Button } from '@dataesr/react-dsfr';

import styles from './modal.cssmodule.scss';

const Modal = ({ step, tooltipProps, closeProps, skipProps, primaryProps, backProps, isLastStep }) => (
  <div className={styles.tooltip} {...tooltipProps}>
    {step.title && <h4 className={styles.title}>{step.title}</h4>}
    <div className={styles.content}>{step.content}</div>
    {!step.hideFooter && (
    <div className={styles.footer}>
      {isLastStep && (
      <Button {...closeProps}>
        Fin
      </Button>
      )}
      {step.showPrevious && (
      <Button {...backProps}>
        Précedent
      </Button>
      )}
      {!isLastStep && !step.showPrevious && (
      <>
        <Button {...skipProps} className={styles.exitButton} secondary>
          Passer
        </Button>
        <Button {...primaryProps} className={styles.nextButton}>
          Suivant
        </Button>
      </>
      )}
    </div>
    )}
  </div>
);

export default Modal;
