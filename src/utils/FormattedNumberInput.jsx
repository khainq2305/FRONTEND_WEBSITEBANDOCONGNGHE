import React from 'react';
import { TextField } from '@mui/material';
import { NumericFormat } from 'react-number-format';

export default function FormattedNumberInput(props) {
  const {
    value,
    onChange,
    error,
    helperText,
    ...rest
  } = props;

  return (
    <NumericFormat
  {...rest}
  value={value ?? ''}
  customInput={TextField}
  fullWidth
  thousandSeparator="."
  decimalSeparator=","
  decimalScale={0}         
  allowDecimalSeparator={false}
  allowNegative={false}
  allowLeadingZeros={false}
  onValueChange={(vals) => onChange(vals.floatValue ?? '')}
  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
  error={error}
  helperText={helperText}
/>

  );
}
