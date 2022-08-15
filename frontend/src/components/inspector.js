import {
  Box, Button, Flex, Label,
} from 'theme-ui';
import { Rnd } from 'react-rnd';
import {
  useContext, useEffect, useMemo, useState,
} from 'react';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import clone from 'lodash.clone';
import isEqual from 'lodash.isequal';
import { fromPromise } from '@apollo/client';
import { AdaptContext } from './contexts';
import Atom from './userComponents/Box';
import FormAPI, {
  Field, Form, FormContext, useForm,
} from '../libs/form';
import { FieldConsumer } from './form';
import Table from './userComponents/Table';
import { toJSON } from './jsonEditor';
import AdaptComponent from './adaptComponent';

const MIN_WIDTH = 100;

const LEFT_PANE = {
  width: 350,
  height: '100%',
  key: 1,
  minWidth: MIN_WIDTH,
  minHeight: '100%',
};

const ENABLE_RESIZING = {
  top: false,
  right: true,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

function* traverseTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      yield* traverseTree(tree[i]);
    }
  } else if (Array.isArray(tree?.props?.children)) {
    yield tree;
    yield* traverseTree(tree.props.children);
  } else {
    yield tree;
  }
}

function fromComponentTreeGetReactTreeComponentData(componentTree, path = []) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;
  const tree = [];

  if (Array.isArray(componentTree)) {
    for (let i = 0; i < componentTree.length; i++) {
      // ignore nodes in the tree which are not react components
      // e.g. text nodes
      if (componentTree[i]?.props) {
        tree.push(
          fromComponentTreeGetReactTreeComponentData(componentTree[i], [
            ...path,
            [parentLevel + 1, i],
          ]),
        );
      }
    }
  }

  if (componentTree?.props?.children?.length) {
    const componentName = componentTree.props.userSelected?.Component?.displayName;
    return {
      key: JSON.stringify(path),
      title: componentName,
      children: fromComponentTreeGetReactTreeComponentData(componentTree.props.children, path),
      adapt: {
        ...componentTree,
      },
    };
  }

  if (componentTree?.props?.userSelected?.Component) {
    const componentName = componentTree.props.userSelected?.Component?.displayName;
    return {
      key: JSON.stringify(path),
      title: componentName,
      children: [],
      adapt: {
        ...componentTree,
      },
    };
  }

  return tree;
}

const COMPONENT_MAP = {
  Box: {
    Component: Atom,
    props: ['sx'],
  },
  Table: {
    Component: Table,
    props: ['backgroundColor'],
  },
};

function getDefaultFieldsForComponent(componentName) {
  if (componentName === 'Box') {
    return {
      sx: {
        type: 'jsonField',
        label: 'Sx',
        initialValue: [],
        pipe: toJSON,
      },
    };
  }
  if (componentName === 'Table') {
    return {
      backgroundColor: {
        type: 'text',
        label: 'Background Color',
        required: true,
        initialValue: 'red',
      },
    };
  }
  return {};
}

function Fields({ fields }) {
  const fieldNames = Object.keys(fields);

  return fieldNames.map((fieldName) => (
    <Field key={fieldName} name={fieldName}>
      <FieldConsumer />
    </Field>
  ));
}

function getNewComponentConfig(formValues) {
  const component = COMPONENT_MAP[formValues.submissionValues.component];
  const config = {
    Component: component.Component,
    props: {},
  };
  for (const prop of component.props) {
    const propValue = formValues.submissionValues[prop];
    config.props[prop] = propValue;
  }
  return config;
}

function Inspector() {
  const { dispatch, elements, elementInView } = useContext(AdaptContext);
  const [devtoolsState, setDevtoolsState] = useState(LEFT_PANE);
  const [selectedComponent, setSelectedComponent] = useState();

  let element;
  if (elementInView >= 0) {
    element = elements[elementInView];
  }

  let componentTree = [];
  if (element?.components) {
    componentTree = element.components;
  }

  const tree = fromComponentTreeGetReactTreeComponentData(componentTree);

  /**
   * TODO - we need a way of mapping the widget output to a value prepared for submission
   * (if there isn't already)
   */

  const initialComponent = 'Box';
  const formApi = useForm({
    fields: {
      component: {
        type: 'select',
        label: 'Component',
        initialValue: {
          label: initialComponent,
          value: initialComponent,
        },
        required: true,
        choices: [
          {
            label: 'Box',
            value: 'Box',
          },
          {
            label: 'Table',
            value: 'Table',
          },
        ],
      },
      ...getDefaultFieldsForComponent(initialComponent),
    },
    onSubmit: (values) => {
      dispatch({
        type: 'addComponentToElement',
        payload: {
          elementInView,
          newComponent: getNewComponentConfig(values),
        },
      });
    },
  });

  useEffect(() => {
    const component = clone(formApi.state.fields.component);
    component.initialValue = { ...formApi.state.values.component };

    const fields = {
      component,
      ...getDefaultFieldsForComponent(component.initialValue.value),
    };

    if (!isEqual(formApi.state.fields, fields)) {
      formApi.resetForm({ fields });
    }
  }, [formApi]);

  return (
    <Flex sx={{ flex: 1 }}>
      <Rnd
        bounds="parent"
        enableResizing={ENABLE_RESIZING}
        disableDragging
        size={{ width: devtoolsState.width, height: devtoolsState.height }}
        position={{ x: devtoolsState.x, y: devtoolsState.y }}
        onDragStop={(e, d) => {
          setDevtoolsState({ ...devtoolsState, x: d.x, y: d.y });
        }}
        onResize={(e, dir, ref, delta, position) => {
          setDevtoolsState({
            ...devtoolsState,
            width: ref.style.width,
            height: ref.style.height,
            ...position,
          });
        }}
        className="devtoolsWrapper"
        key={devtoolsState.key}
        minWidth={devtoolsState.minWidth}
        minHeight={devtoolsState.minHeight}
      >
        <Box sx={{ height: '100%', pr: 2 }}>
          {element ? (
            <>
              <Tree
                onSelect={(key, obj) => {
                  setSelectedComponent(obj.node.adapt);
                }}
                showLine
                showIcon={false}
                treeData={tree}
              />
              <Box sx={{ mt: 5 }}>
                <FormContext.Provider value={formApi}>
                  <Form>
                    <Fields fields={formApi.state.fields} />
                    <Button variant="primary">Add</Button>
                  </Form>
                </FormContext.Provider>
              </Box>
            </>
          ) : (
            <Box>No element selected to inspect</Box>
          )}
        </Box>
      </Rnd>
      <Box
        sx={{
          borderLeftColor: 'haze',
          borderLeftStyle: 'solid',
          borderLeftWidth: 1,
          flex: 1,
        }}
      >
        {JSON.stringify(selectedComponent?.props?.userSelected?.props)}
      </Box>
    </Flex>
  );
}

export default Inspector;
