import React, { useEffect,useState } from "react";
import { isStringControl, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { MaterialInputControl } from "@jsonforms/material-renderers";
import merge from 'lodash/merge'
import { useDebouncedChange } from "@jsonforms/material-renderers";
import CustomTextField from "../CustomInput";



const EnrichmentInput = (metaProps) => {


	const MuiInputText = (props) => { 
		const eventToValue = (ev) => ev.target.value === '' ? undefined : ev.target.value;
		const [typing, setTyping] = useState(false);
		const {data,config,id,uischema,path,handleChange,schema,muiInputProps,type,debounced=0} = props;
		const maxLength = schema.maxLength;
		const appliedUiSchemaOptions = merge({}, config, uischema.options);
		let inputProps;

		if (appliedUiSchemaOptions.restrict) {
		  inputProps = { maxLength: maxLength };
		} else {
		  inputProps = {};
		}

		useEffect(()=>{
			
		},[])
		
		inputProps = merge(inputProps, muiInputProps);
		
		if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
		  inputProps.size = maxLength;
		};
		
		const [inputText, onChange, onClear] = useDebouncedChange(
			handleChange,
			'',
			data,
			path,
			eventToValue,
			debounced
		);


		useEffect(() => {
			let timeoutId;
		  
			if (typing) {
			  timeoutId = setTimeout(() => {
				setTyping(false);
			  }, (type==="create"?2000:4000));
			}
		  
			return () => {
			  clearTimeout(timeoutId);
			};
			//eslint-disable-next-line
		  }, [typing]);
		
		return (	
			<CustomTextField 
				variant="standard"
				typing={typing}
				setTyping={setTyping}
				handleInputChange={onChange}
				value={inputText}
				id={id}
				label={uischema.otherLabel}
				onBlurToTyping={(type==="create")}
				handleClearClick={onClear}
				unableClear={debounced!==0}
			/>
		);
	}
	
	const MaterialTextControl = (props) => {

		return <MaterialInputControl {...props} {...metaProps} input={MuiInputText}  />
	};
	
	const tester = rankWith(2, isStringControl);
	const renderer = withJsonFormsControlProps(MaterialTextControl);
	
	const Renderer = { tester, renderer };
	
	return Renderer;

}

export default EnrichmentInput;
