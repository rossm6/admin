import {
  useCallback, useContext, useMemo, useState,
} from 'react';
import {
  Box, Button, Checkbox, Close, Flex, IconButton, Input, Label, Select,
} from 'theme-ui';
import PropTypes from 'prop-types';
import { FieldContext, FormContext } from '../libs/form';
import JSONEditor from './jsonEditor';

/**
 * I cannot get the theme-ui checkbox to work
 * because the the input field, on which the onChange
 * handler is applied, is covered by the svg.
 */

export function CheckboxWrapper({
  id, name, value, onChange, checked,
}) {
  return (
    <input
      id={id}
      name={name}
      value={value?.value}
      checked={checked}
      type="checkbox"
      onChange={onChange}
    />
  );
}

CheckboxWrapper.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};

CheckboxWrapper.defaultProps = {
  id: undefined,
};

function SelectWithOptions({
  id, name, value, variant = 'bootstrap', onChange, sx, choices,
}) {
  return (
    <Select id={id} name={name} variant={variant} onChange={onChange} sx={sx}>
      {choices?.map((choice) => (
        <option key={choice.value} value={choice.value}>
          {choice.label}
        </option>
      ))}
    </Select>
  );
}

function JSONEditorAdapter({ name, value }) {
  const { dispatch } = useContext(FormContext);

  const setTreeData = useCallback(
    (tree) => {
      dispatch({
        type: 'setFieldValue',
        payload: {
          name,
          value: tree,
        },
      });
    },
    [dispatch, name],
  );

  return <JSONEditor treeData={value} setTreeData={setTreeData} />;
}

export function FieldConsumer() {
  const {
    label: { htmlFor, label },
    inputField: {
      props: {
        name, value, id, onChange, type, isChecked, choices,
      },
    },
    errors,
  } = useContext(FieldContext);

  let InputComponent = Input;
  if (type === 'checkbox') {
    InputComponent = CheckboxWrapper;
  } else if (type === 'select') {
    InputComponent = SelectWithOptions;
  } else if (type === 'jsonField') {
    InputComponent = JSONEditorAdapter;
  }

  return (
    <Box>
      <Label htmlFor={htmlFor}>{label}</Label>
      <InputComponent
        id={id}
        name={name}
        value={value}
        variant="bootstrap"
        onChange={onChange}
        sx={{ my: 2 }}
        checked={isChecked(value)}
        choices={choices}
      />
      {!!errors?.length && (
        <Box>
          {errors.map((error) => (
            <Box key={error} sx={{ color: 'red' }}>
              {error}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
