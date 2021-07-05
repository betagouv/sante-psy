import React from 'react';
import TextInput from './TextInput';
import SearchableSelect from './SearchableSelect';

const Input = props => {
  switch (props.type) {
    case 'searchableSelect':
      return <SearchableSelect {...props} />;
    case 'text':
    default:
      return <TextInput {...props} />;
  }
};

export default Input;
