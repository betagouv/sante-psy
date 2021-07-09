import React from 'react';
import classnames from 'classnames';

import {
  Container,
  Row,
  Col,
  Title,
  Text,
} from '@dataesr/react-dsfr';

import styles from './page.cssmodule.scss';

const Page = ({ title, description, background, children, dataTestId }) => (
  <Container spacing="py-4w" className={styles[background]}>
    <Row>
      <Col>
        <div className={classnames('fr-container fr-pb-3w', styles.container)} data-test-id={dataTestId}>
          <Row>
            <Col spacing="py-3w" className={styles.sectionTitle}>
              <Title as="h1" look="h2" className={styles.title}>{title}</Title>
              <Text size="lg">{description}</Text>
            </Col>
          </Row>
          <Row>
            <Col>
              {children}
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Page;
