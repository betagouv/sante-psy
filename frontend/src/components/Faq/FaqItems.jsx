import React from 'react';

import faq from 'services/faq/faq';
import { useStore } from 'stores/';
import FaqItem from './FaqItem';

const FaqItems = ({ section }) => {
  const { commonStore: { config } } = useStore();
  return (
    faq[section](config).map((item, index) => (
      <FaqItem key={item.question} item={item} index={index} section={section} />
    ))
  );
};

export default FaqItems;
