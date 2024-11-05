import React from 'react';
import Service from './Service';
import servicesData from './servicesData';
import styles from './service.cssmodule.scss';

const ServicesList = ({ small }) => (
  <div className={styles.services}>
    {servicesData.map((service) => (
      <Service
        key={service.name}
        image={small ? service.imageSmall : service.imageLarge}
        logo={service.logo}
        name={service.name}
        title={service.title}
        description={service.description}
        link={service.link}
      />
    ))}
  </div>
);

export default ServicesList;
