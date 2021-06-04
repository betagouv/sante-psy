import React from 'react';
import CheckBox from './CheckBox';
import Radio from './Radio';
import TextInput from './TextInput';
import Select from './Select';

const Input = props => {
  switch (props.type) {
    case 'checkbox':
      return <CheckBox {...props} />;
    case 'select':
      return <Select {...props} />;
    case 'radio':
      return <Radio {...props} />;
    case 'text':
    case 'textarea':
    default:
      return <TextInput {...props} />;
  }
};

export default Input;
