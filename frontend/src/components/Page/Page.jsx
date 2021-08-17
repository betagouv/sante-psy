import React from 'react';
import classnames from 'classnames';

import {
  Container,
  Row,
  Col,
  Text,
} from '@dataesr/react-dsfr';

import Section from '../Landing/Section';
import UnderlinedTitle from './UnderlinedTitle';

import styles from './page.cssmodule.scss';

const Page = ({
  title,
  description,
  background,
  children,
  textContent,
  withContact,
  className = null,
  dataTestId = null,
}) => (
  <>
    <Container
      spacing="py-4w"
      className={classnames(className, styles[background])}
    >
      <div className={styles.container} data-test-id={dataTestId}>
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
    {withContact && (
    <Container
      spacing="py-4w"
      className={styles.sectionFaq}
    >
      <Section
        title="Vous avez une question ?"
        description="Retrouvez les réponses aux questions les plus fréquemment posées."
        buttonAlignment="right"
        buttonText="Consulter la foire aux questions"
        buttonUrl="/faq"
        buttonSecondary
      />
    </Container>
    ) }
  </>
);

export default Page;
