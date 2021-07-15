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

const Page = ({ title, description, background, children, className = null, dataTestId = null }) => (
  <Container spacing="py-4w" className={classnames(className, styles[background])}>
    <div className={styles.container} data-test-id={dataTestId}>
      <Row>
        <Col className={styles.sectionTitle}>
          <Title as="h1" look="h2" className={styles.title}>{title}</Title>
          {description && <Text size="lg">{description}</Text>}
        </Col>
      </Row>
      <Row>
        <Col>
          {children}
        </Col>
      </Row>
    </div>
  </Container>
);

export default Page;
