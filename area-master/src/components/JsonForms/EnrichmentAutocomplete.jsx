import React from 'react';
import {  isEnumControl, rankWith, } from '@jsonforms/core';
import { withJsonFormsEnumProps, withTranslateProps } from '@jsonforms/react';
import MyAutocomplete from '../MyAutocomplete';
const EnrichmentAutocomplete = (metaProps) => {

  const MuiAutocomplete = (props) => {
    const { data, uischema, path, handleChange } = props;
   
    return ( 
      <MyAutocomplete 
      value={data}
      onInputChange={(a) => {}}
      label={uischema.label}
      onChange= {(e, newValue) => {
        handleChange(metaProps.aditionalSave, newValue && newValue.ID);
        handleChange(path, newValue);
      }}
      options={metaProps.options}
      />
    );
  }
  
  const tester = rankWith(5, isEnumControl);
  const renderer = withJsonFormsEnumProps(withTranslateProps(MuiAutocomplete));
  const Renderer = { tester, renderer };
  return Renderer;
}

export default EnrichmentAutocomplete;