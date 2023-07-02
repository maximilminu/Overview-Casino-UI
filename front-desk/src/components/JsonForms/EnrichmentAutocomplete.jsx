import React, { ReactNode } from 'react';
import { ControlProps, EnumCellProps, EnumOption, isDescriptionHidden, isEnumControl, rankWith, scopeEndsWith, WithClassname } from '@jsonforms/core';

import merge from 'lodash/merge';
import { MaterialInputControl, MuiSelect, useFocus } from '@jsonforms/material-renderers';
import { useState } from 'react';
import { withJsonFormsControlProps, withJsonFormsEnumProps, withTranslateProps } from '@jsonforms/react';
import {AutocompleteRenderOptionState,FilterOptionsState,FormHelperText,Hidden,TextField} from '@mui/material';
import MyAutocomplete from '../MyAutocomplete';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';

const EnrichmentAutocomplete = (metaProps) => {

  const MuiAutocomplete = (props) => {
    const {
      description,
      errors,
      visible,
      required,
      label,
      data,
      className,
      id,
      enabled,
      uischema,
      path,
      handleChange,
      config,
      getOptionLabel,
      renderOption,
      filterOptions,
      isValid,
      options
    } = props;

    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    const [inputValue, setInputValue] = useState(data ? data.Parents : "");
    
    const [customOptions , setCustomOptions] = useState([])
    

  

    return ( 
      <MyAutocomplete 
      inputValue={inputValue} 
      onInputChange={(a)=>{
        setCustomOptions(props.findOnTree(props.tree,a.target.value))
        handleChange("Autocomplete",a.target.value)
        }
    }
      onChange={handleChange}
      data={data}
      options={customOptions}
      />
    );
  }

 const MaterialEnumControl = (props) => {
    const {config, uischema, errors} = props;

    const isValid = errors.length === 0;
    return (
      <MuiAutocomplete
        {...props}
        {...metaProps}
        isValid={isValid}
        options={metaProps.options}
      />
    );
  };
  
const tester = rankWith(5, isEnumControl);
  
const renderer = withJsonFormsEnumProps(withTranslateProps(MaterialEnumControl));

const Renderer = { tester, renderer };

return Renderer;
}
export default EnrichmentAutocomplete;