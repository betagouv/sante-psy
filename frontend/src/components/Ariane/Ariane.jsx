import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@dataesr/react-dsfr';

const Ariane = ({ previous, current }) => (
  <Breadcrumb>
    {previous.map(item => (
      <BreadcrumbItem
        key={item.label}
        asLink={<Link to={item.url} />}
      >
        {item.label}
      </BreadcrumbItem>
    ))}
    <BreadcrumbItem>
      {current}
    </BreadcrumbItem>
  </Breadcrumb>
);

export default Ariane;
