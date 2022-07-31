import {
  Box, Divider, Flex, Heading,
} from 'theme-ui';
import { CopyBlock, github } from 'react-code-blocks';
import ReactJson from '@microlink/react-json-view';
import { useContext } from 'react';
import FormAPI, { Field, FormContext, useForm } from '../../libs/form';

const codeBlock1 = `
<FormAPI
  fields={{
    name: {
      type: 'text',
      initialValue: '',
      label: 'Name',
    },
    age: {
      type: 'number',
      initialValue: '',
      label: 'Age',
    },
    gender: {
      type: 'select',
      choices: [
        {
          label: '------',
          value: '',
        },
        {
          label: 'Female',
          value: 'f',
        },
        {
          label: 'Male',
          value: 'm',
        },
      ],
      initialValue: {
        label: '------',
        value: '',
      },
      label: 'Gender',
    },
  }}
>
  <Field name="name" />
  <Field name="age" />
  <Field name="gender" />
</FormAPI>
`;

function FormStateJSONView() {
  const { state } = useContext(FormContext);
  return <ReactJson src={state} />;
}

const defaultComponentsUsingHookCodeBlock = `
function DefaultComponentsUseHook() {
  const formAPI = useForm({
    fields: {
      name: {
        type: 'text',
        initialValue: '',
        label: 'Name',
      },
      age: {
        type: 'number',
        initialValue: '',
        label: 'Age',
      },
      gender: {
        type: 'select',
        choices: [
          {
            label: '------',
            value: '',
          },
          {
            label: 'Female',
            value: 'f',
          },
          {
            label: 'Male',
            value: 'm',
          },
        ],
        initialValue: {
          label: '------',
          value: '',
        },
        label: 'Gender',
      },
    },
    prefix: 'default-components-hook',
  });

  return (
    <FormContext.Provider value={formAPI}>
      <FormStateJSONView />
      <Field name="name" />
      <Field name="age" />
      <Field name="gender" />
    </FormContext.Provider>
  );
}
`;

function DefaultComponentsUseHook() {
  const formAPI = useForm({
    fields: {
      name: {
        type: 'text',
        initialValue: '',
        label: 'Name',
      },
      age: {
        type: 'number',
        initialValue: '',
        label: 'Age',
      },
      gender: {
        type: 'select',
        choices: [
          {
            label: '------',
            value: '',
          },
          {
            label: 'Female',
            value: 'f',
          },
          {
            label: 'Male',
            value: 'm',
          },
        ],
        initialValue: {
          label: '------',
          value: '',
        },
        label: 'Gender',
      },
    },
    prefix: 'default-components-hook',
  });

  return (
    <FormContext.Provider value={formAPI}>
      <FormStateJSONView />
      <Field name="name" />
      <Field name="age" />
      <Field name="gender" />
    </FormContext.Provider>
  );
}

function FormDemo() {
  /**
   * The CopyBlock library is not actively maintained.  It suggests other
   * libraries - https://github.com/rajinwonderland/react-code-blocks#alternatives
   *
   * There is a library for parsing strings into jsx: https://github.com/TroyAlford/react-jsx-parser
   */

  return (
    <Flex
      sx={{
        alignItems: 'center',
        flexDirection: 'column',
        overflow: 'auto',
        height: '100vh',
        maxHeight: '100vh',
      }}
    >
      <Box sx={{ maxWidth: 900, width: '100%' }}>
        <Heading as="h2">Default components</Heading>
        <Box>
          <Box>
            <Heading as="h3" sx={{ my: 4 }}>
              Form component
            </Heading>
            <Box
              sx={{
                borderRadius: 5,
                borderColor: 'slate',
                p: 4,
              }}
            >
              <FormAPI
                fields={{
                  name: {
                    type: 'text',
                    initialValue: '',
                    label: 'Name',
                  },
                  age: {
                    type: 'number',
                    initialValue: '',
                    label: 'Age',
                  },
                  gender: {
                    type: 'select',
                    choices: [
                      {
                        label: '------',
                        value: '',
                      },
                      {
                        label: 'Female',
                        value: 'f',
                      },
                      {
                        label: 'Male',
                        value: 'm',
                      },
                    ],
                    initialValue: {
                      label: '------',
                      value: '',
                    },
                    label: 'Gender',
                  },
                }}
              >
                <FormStateJSONView />
                <Field name="name" />
                <Field name="age" />
                <Field name="gender" />
              </FormAPI>
            </Box>
            <Box
              sx={{
                borderColor: 'haze',
                fontSize: 10,
                overflow: 'auto',
                height: 400,
                p: 4,
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <CopyBlock
                language="jsx"
                text={codeBlock1}
                showLineNumbers
                theme={github}
                wrapLines
                codeBlock
              />
            </Box>
          </Box>
          <Divider sx={{ my: 50 }} />
          <Box>
            <Heading as="h3" sx={{ my: 4 }}>
              Form Hook
            </Heading>
            <Box
              sx={{
                borderRadius: 5,
                borderColor: 'slate',
                p: 4,
              }}
            >
              <DefaultComponentsUseHook />
            </Box>
            <Box
              sx={{
                borderColor: 'haze',
                fontSize: 10,
                overflow: 'auto',
                height: 400,
                p: 4,
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <CopyBlock
                language="jsx"
                text={defaultComponentsUsingHookCodeBlock}
                showLineNumbers
                theme={github}
                wrapLines
                codeBlock
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

export default FormDemo;
