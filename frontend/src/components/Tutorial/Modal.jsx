import React from 'react';
import { Button, Icon } from '@dataesr/react-dsfr';

import styles from './modal.cssmodule.scss';

const Modal = ({ step, tooltipProps, closeProps, skipProps, primaryProps, backProps, isLastStep, index }) => (
  <div className={styles.tooltip} {...tooltipProps}>
    <div {...skipProps} className={styles.closeButton} data-test-id="close-tutorial">
      <Icon name="fr-fi-close-line" />
    </div>
    {step.title && <h4 className={styles.title}>{step.title}</h4>}
    <div className={styles.content}>{step.content}</div>
    {!step.hideFooter && (
    <div className={styles.footer}>
      {isLastStep && (
      <Button {...closeProps} data-test-id="end-tutorial">
        Fin
      </Button>
      )}
      {!isLastStep && (
      <>
        {index > 0 && (
          <Button {...backProps} className={styles.backButton} secondary data-test-id="previous-step">
            Précedent
          </Button>
        )}
        <Button {...primaryProps} className={styles.nextButton} data-test-id="next-step">
          Suivant
        </Button>
      </>
      )}
    </div>
    )}
  </div>
);

export default Modal;
