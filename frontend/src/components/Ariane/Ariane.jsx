import React from 'react';
import { Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb';

const Ariane = ({ previous, current }) => (
  <Breadcrumb
    segments={previous.map((item) => ({
      label: item.label,
      linkProps: { to: item.url },
    }))}
    currentPageLabel={current}
  />
);

export default Ariane;
