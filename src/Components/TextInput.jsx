import React from 'react';

import Helpers from "../styles/Helpers";

export default function TextInput( props ) {
  return (
    <Helpers.Label width={ props.width || "45%" }>
      { props.label }
      <Helpers.TextInput
        value={ props.value }
        onChange={ props.onChange }
        onBlur={ props.onBlur }
        error={ props.errorMessage ? true : false }
      />
      { props.errorMessage && (
        <Helpers.Font error>* { props.errorMessage }</Helpers.Font>
      ) }
    </Helpers.Label> 
  )
}

