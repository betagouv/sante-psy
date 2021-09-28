import React from 'react';
import { Button, Icon } from '@dataesr/react-dsfr';

import styles from './modal.cssmodule.scss';

const Modal = ({ step, tooltipProps, closeProps, skipProps, primaryProps, backProps, isLastStep, index }) => (
  <div className={styles.tooltip} {...tooltipProps}>
    <div {...skipProps} className={styles.closeButton}>
      <Icon name="fr-fi-close-line" />
    </div>
    {step.title && <h4 className={styles.title}>{step.title}</h4>}
    <div className={styles.content}>{step.content}</div>
    {!step.hideFooter && (
    <div className={styles.footer}>
      {isLastStep && (
      <Button {...closeProps}>
        Fin
      </Button>
      )}
      {!isLastStep && (
      <>
        {index > 0 && (
          <Button {...backProps} className={styles.backButton} secondary>
            Précedent
          </Button>
        )}
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
