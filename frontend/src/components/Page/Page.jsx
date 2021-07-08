import React from 'react';

import {
  Container,
  Row,
  Col,
  Title,
  Text,
} from '@dataesr/react-dsfr';

import styles from './page.cssmodule.scss';

const Page = ({ title, description, background, children }) => (
  <Container justifyContent="center" spacing="py-4w" className={styles[background]}>
    <Row>
      <Col>
        <Container justifyContent="center" spacing="pb-3w" className={styles.container}>
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
        </Container>
      </Col>
    </Row>
  </Container>
);

export default Page;
