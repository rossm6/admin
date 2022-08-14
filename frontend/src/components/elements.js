import {
  useCallback, useContext, useMemo, useState,
} from 'react';
import {
  Box, Button, Checkbox, Close, Flex, IconButton, Input, Label,
} from 'theme-ui';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { AdaptContext } from './contexts';
import Plus from '../icons/plus.svg';
import FormAPI, { Field, FieldContext, Form } from '../libs/form';
import { FieldConsumer } from './form';

function createElement(name) {
  return {
    name,
    components: [],
  };
}

function Elements() {
  const {
    dispatch, elements, setElements, elementInView,
  } = useContext(AdaptContext);
  const [showForm, setShowForm] = useState(false);

  const formFields = useMemo(() => {
    const elementNames = elements.map((element) => element.name);
    return {
      element: {
        type: 'text',
        label: 'Element',
        initialValue: '',
        required: true,
        validation: yup
          .string()
          .required()
          .label('Element')
          .test('unique', 'This name is already taken', (name) => !elementNames.includes(name)),
      },
      inspect: {
        type: 'checkbox',
        label: 'Inspect new element',
        initialValue: {
          value: true,
        },
        required: false,
      },
    };
  }, [elements]);

  const onSubmit = useCallback(
    ({ submissionValues }) => {
      const { length } = elements.length;
      setElements([
        ...elements,
        {
          name: submissionValues.element,
          components: [],
        },
      ]);
      if (submissionValues.inspect) {
        dispatch({
          type: 'elementInView',
          payload: {
            elementInView: length,
          },
        });
      }
    },
    [dispatch, elements, setElements],
  );

  return (
    <Box>
      {!showForm && (
        <IconButton onClick={() => setShowForm(true)}>
          <Plus />
        </IconButton>
      )}
      {showForm && (
        <Box sx={{ p: 2 }}>
          <Flex sx={{ justifyContent: 'flex-end' }}>
            <Close onClick={() => setShowForm(false)} sx={{ cursor: 'pointer', p: 0 }} />
          </Flex>
          <FormAPI fields={formFields} onSubmit={onSubmit}>
            <Form>
              <Field name="element">
                <FieldConsumer />
              </Field>
              <Field name="inspect">
                <FieldConsumer />
              </Field>
              <Button type="submit" variant="primary" sx={{ my: 2, width: '100%' }}>
                Add
              </Button>
            </Form>
          </FormAPI>
        </Box>
      )}
      {elements.map((element, index) => (
        <Box
          key={element.name}
          onClick={() => {
            dispatch({
              type: 'elementInView',
              payload: {
                elementInView: index,
              },
            });
          }}
          sx={{
            borderBottomStyle: 'solid',
            borderBottomWidth: 1,
            borderTopStyle: 'solid',
            borderColor: 'haze',
            borderTopWidth: index === 0 ? 1 : 0,
            cursor: 'pointer',
            p: 2,
          }}
        >
          {element.name}
        </Box>
      ))}
    </Box>
  );
}

export default Elements;
