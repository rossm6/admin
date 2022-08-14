import { Box, Flex } from 'theme-ui';
import { Rnd } from 'react-rnd';
import { useContext, useState } from 'react';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.css';
import { AdaptContext } from './contexts';
import Atom from './userComponents/Box';

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

function AdaptComponent() {
  return null;
}

function Inspector() {
  const { elements, elementInView } = useContext(AdaptContext);
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

  componentTree = [
    {
      Component: AdaptComponent,
      props: {
        children: [
          {
            Component: AdaptComponent,
            props: {
              children: [
                {
                  Component: AdaptComponent,
                  props: {
                    children: [],
                    userSelected: {
                      Component: Atom,
                      props: {
                        color: 'blue',
                      },
                    },
                  },
                },
                {
                  Component: AdaptComponent,
                  props: {
                    children: [],
                    userSelected: {
                      Component: Atom,
                      props: {
                        color: 'blue',
                      },
                    },
                  },
                },
              ],
              userSelected: {
                Component: Atom,
                props: {
                  color: 'blue',
                },
              },
            },
          },
          {
            Component: AdaptComponent,
            props: {
              children: [],
              userSelected: {
                Component: Atom,
                props: {
                  color: 'blue',
                },
              },
            },
          },
        ],
        userSelected: {
          Component: Atom,
          props: {
            color: 'blue',
          },
        },
      },
    },
  ];

  const tree = fromComponentTreeGetReactTreeComponentData(componentTree);

  console.log(selectedComponent);

  return (
    <Flex sx={{ flex: 1 }}>
      <Rnd
        bounds="parent"
        enableResizing={ENABLE_RESIZING}
        disableDragging={false}
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
        <Tree
          onSelect={(key, obj) => {
            setSelectedComponent(obj.node.adapt);
          }}
          showLine
          showIcon={false}
          treeData={tree}
        />
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
