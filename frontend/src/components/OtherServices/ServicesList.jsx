import React from 'react';
import Service from './Service';
import servicesData from './allServicesData';
import styles from './service.cssmodule.scss';
import urgentServicesData from './urgentServicesData';

const ServicesList = ({ small, urgentServices = false }) => {
  const dataToMap = urgentServices ? urgentServicesData : servicesData;

  return (
    <div className={styles.services}>
      {dataToMap.map(service => (
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
};

export default ServicesList;
