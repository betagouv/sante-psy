import React, { useState } from 'react';
import classnames from 'classnames';

import {
  Container,
  Row,
  Col,
  Text,
  Icon,
} from '@dataesr/react-dsfr';

import Tutorial from 'components/Tutorial/Tutorial';
import FaqSection from './FaqSection';
import UnderlinedTitle from './UnderlinedTitle';

import styles from './page.cssmodule.scss';

const Page = ({
  title,
  description,
  background,
  children,
  textContent,
  withContact,
  tutorial,
  className = null,
  dataTestId = null,
}) => {
  const [tutoStatus, setTutoStatus] = useState({ run: false, stepIndex: 0 });
  return (
    <>
      <Tutorial
        tutoStatus={tutoStatus}
        setTutoStatus={setTutoStatus}
        id={tutorial}
      >
        <Container
          spacing="py-4w"
          className={classnames(className, styles[background])}
        >
          <div className={styles.container} data-test-id={dataTestId}>
            {tutorial && (
              <div
                className={styles.tutorial}
                onClick={() => setTutoStatus({ run: true, stepIndex: 0 })}
              >
                <Icon
                  name="fr-fi-information-fill"
                />
              </div>
            )}
            <Row>
              <Col className={styles.sectionTitle}>
                <UnderlinedTitle title={title} className="fr-mb-1w" />
                {description && <Text size="lg">{description}</Text>}
              </Col>
            </Row>
            <Row>
              <Col>
                {textContent
                  ? <div className={styles.textContainer}>{children}</div>
                  : children}
              </Col>
            </Row>
          </div>
        </Container>
        {withContact && <FaqSection /> }
      </Tutorial>
    </>
  );
};

export default Page;
