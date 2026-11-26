import React from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { fr } from '@codegouvfr/react-dsfr';

import styles from './modal.cssmodule.scss';

const Modal = ({
  step,
  tooltipProps,
  closeProps,
  skipProps,
  primaryProps,
  backProps,
  isLastStep,
  index,
}) => (
  <div className={styles.tooltip} {...tooltipProps}>
    <div
      {...skipProps}
      className={styles.closeButton}
      data-test-id="close-tutorial"
    >
      <span className={fr.cx('fr-icon-close-line')} aria-hidden="true" />
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
              <Button
                {...backProps}
                className={styles.backButton}
                priority="secondary"
                data-test-id="previous-step"
              >
                Précédent
              </Button>
            )}

            <Button
              {...primaryProps}
              className={styles.nextButton}
              data-test-id="next-step"
            >
              Suivant
            </Button>
          </>
        )}
      </div>
    )}
  </div>
);

export default Modal;
