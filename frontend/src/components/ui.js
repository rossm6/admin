import { Box, Button, IconButton } from 'theme-ui';
import PropTypes, { element } from 'prop-types';
import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import isObject from 'lodash.isobject';
import clone from 'lodash.clone';
import { isString } from 'lodash';
import propTypes from '../propTypes';
import { AdaptContext } from './contexts';
import RecursiveComponentTree from './componentTree';
import CaretRight from '../icons/caretRight.svg';
import PlusCircleFill from '../icons/plusCircleFill.svg';
import PencilFill from '../icons/pencilFill.svg';

function ComponentTree(element) {
  if (!element?.components?.length) {
    return <Box>This element contains no elements</Box>;
  }

  return <RecursiveComponentTree tree={element.components} />;
}

function getAllPaths(tree, paths = [], path = []) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;
  let newPaths;

  if (path.length) {
    newPaths = [...paths, path.join(',')];
  }

  if (Array.isArray(tree)) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tree.length; i++) {
      newPaths = getAllPaths(paths, [...path, [parentLevel + 1, i]], tree[i]);
    }
  }
  if (tree?.props?.children?.length) {
    newPaths = getAllPaths(paths, path, tree.props.children);
  }

  return newPaths;
}

function getComponentTreeRefs(componentTree) {
  const paths = getAllPaths(componentTree, [], []);
  const numberOfComponents = new Set(paths).size;

  const refs = [];

  for (let i = 0; i < numberOfComponents; i++) {
    refs.push({
      ref: {
        current: undefined,
      },
    });
  }

  return refs;
}

function CollapseButton({ expandNode, path, tree }) {
  const sx = {
    cursor: 'pointer',
  };
  if (tree.expand) {
    sx.transform = 'rotate(90deg)';
  }
  return <CaretRight onClick={() => expandNode(path, !tree.expand)} style={sx} />;
}

function getNodeAtPath(treeData, path, childrenKey = 'value') {
  const point = path[0];
  if (path.length > 1) {
    return getNodeAtPath(treeData[point[1]][childrenKey], path.slice(1, undefined));
  }
  return treeData[point[1]];
}

function* traverseTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      yield* traverseTree(tree[i]);
    }
  } else if (Array.isArray(tree?.value)) {
    yield tree;
    yield* traverseTree(tree.value);
  } else if (tree?.value !== undefined) {
    yield tree;
  } else {
    yield tree;
  }
}

function CollaspableNode({
  expandNode,
  path,
  tree,
  wholeTree,
  onChange,
  onLosingFocus,
  edit,
  parentCollapsableNodeIsExpanded,
  addPropToValue,
  elementToFocusOn,
}) {
  let showButton = true;
  if (path.length > 1) {
    const node = getNodeAtPath(wholeTree, path.slice(-2, -1));
    if (!node.expand) {
      showButton = false;
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: tree.expand ? 'column' : 'row' }}>
      <Box sx={{ whiteSpace: 'pre-wrap' }}>
        {showButton && <CollapseButton expandNode={expandNode} tree={tree} path={path} />}
        {tree.key}
        :
        {'   '}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: tree.expand ? 'column' : 'row',
          ml: tree.expand ? 4 : 0,
        }}
      >
        <JSONEditorComponent
          expandNode={expandNode}
          path={path}
          tree={tree.value}
          wholeTree={wholeTree}
          onChange={onChange}
          onLosingFocus={onLosingFocus}
          edit={edit}
          parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded && !!tree.expand}
          addPropToValue={addPropToValue}
          elementToFocusOn={elementToFocusOn}
        />
      </Box>
    </Box>
  );
}

function JSONEditorComponent({
  expandNode,
  path = [],
  tree,
  wholeTree,
  onChange,
  onLosingFocus,
  edit,
  parentCollapsableNodeIsExpanded = true,
  addPropToValue,
  elementToFocusOn,
}) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;

  if (Array.isArray(tree)) {
    return (
      <>
        {tree.map((node, index) => (
          <JSONEditorComponent
            expandNode={expandNode}
            key={JSON.stringify([...path, [parentLevel + 1, index]])}
            path={[...path, [parentLevel + 1, index]]}
            tree={node}
            wholeTree={wholeTree}
            onChange={onChange}
            onLosingFocus={onLosingFocus}
            edit={edit}
            parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded}
            addPropToValue={addPropToValue}
            elementToFocusOn={elementToFocusOn}
          />
        ))}
        {parentCollapsableNodeIsExpanded && (
          <IconButton
            onClick={() => addPropToValue(path)}
            sx={{ color: 'blue', cursor: 'pointer' }}
          >
            <PlusCircleFill />
          </IconButton>
        )}
      </>
    );
  }

  if (Array.isArray(tree?.value)) {
    return (
      <CollaspableNode
        expandNode={expandNode}
        path={path}
        tree={tree}
        wholeTree={wholeTree}
        onChange={onChange}
        onLosingFocus={onLosingFocus}
        edit={edit}
        parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded}
        addPropToValue={addPropToValue}
        elementToFocusOn={elementToFocusOn}
      />
    );
  }

  if (!tree?.cssValue) {
    return (
      <Box sx={{ display: 'flex' }}>
        {tree.editKey ? (
          <textarea
            onChange={(e) => {
              onChange(path, e.target.value);
            }}
            onBlur={() => onLosingFocus(path, 'key')}
            value={tree.key}
          />
        ) : (
          <Box sx={{ whiteSpace: 'pre-wrap' }}>
            {tree.key}
            :
            {'   '}
          </Box>
        )}
        {tree.editValue ? (
          <textarea
            onChange={(e) => {
              onChange(path, e.target.value);
            }}
            onBlur={() => onLosingFocus(path, 'value')}
            value={tree.value}
          />
        ) : (
          <Box>{tree.value.value}</Box>
        )}
        {parentCollapsableNodeIsExpanded && (
          <IconButton>
            <PlusCircleFill onClick={() => addPropToValue(path)} />
          </IconButton>
        )}
      </Box>
    );
  }

  return tree?.edit ? (
    <textarea
      onChange={(e) => onChange(path, e.target.value)}
      ref={elementToFocusOn}
      value={tree?.value}
      style={{
        display: tree?.edit ? 'block' : 'none',
      }}
    />
  ) : (
    <div onClick={() => edit(path)}>{tree?.value}</div>
  );
}

function JSONEditor({ tree }) {
  const [treeData, setTreeData] = useState(tree);
  const elementToFocusOn = useRef();

  useEffect(() => {
    if (elementToFocusOn.current) {
      console.log(elementToFocusOn);
      elementToFocusOn.current.focus();
    }
  });

  const expandNode = useCallback(
    (path, expand) => {
      const copy = clone(treeData);
      // traverse the tree
      const node = getNodeAtPath(copy, path);
      node.expand = expand;
      for (const childNode of traverseTree(node.value)) {
        if (childNode.expand) {
          childNode.expand = false;
        }
      }
      setTreeData(copy);
    },
    [treeData, setTreeData],
  );

  const onChange = useCallback(
    (path, value, keyToChange = 'value') => {
      const copy = clone(treeData);
      const node = getNodeAtPath(copy, path);
      node[keyToChange] = value;
      setTreeData(copy);
    },
    [treeData, setTreeData],
  );

  const edit = useCallback(
    (path) => {
      const copy = clone(treeData);
      const node = getNodeAtPath(copy, path);
      node.edit = true;
      setTreeData(copy);
    },
    [treeData, setTreeData],
  );

  const addPropToValue = useCallback(
    (path) => {
      if (path.length) {
        const copy = clone(treeData);
        const node = getNodeAtPath(copy, path);
        if (node?.value?.cssValue) {
          node.value = [
            node.value,
            {
              cssValue: true,
              value: '...',
              edit: false,
            },
          ];
        } else if (Array.isArray(node.value)) {
          node.value = [
            ...node.value,
            {
              cssValue: true,
              value: '...',
              edit: false,
            },
          ];
        }
        setTreeData(copy);
      } else {
        setTreeData([
          ...treeData,
          {
            key: '',
            value: {
              cssValue: true,
              value: '',
              edit: false,
            },
          },
        ]);
      }
    },
    [treeData, setTreeData],
  );

  return (
    <JSONEditorComponent
      edit={edit}
      expandNode={expandNode}
      onChange={onChange}
      onLosingFocus={onLosingFocus}
      tree={treeData}
      wholeTree={treeData}
      addPropToValue={addPropToValue}
      elementToFocusOn={elementToFocusOn}
    />
  );
}

function Ui({ sx }) {
  const { elements, elementInView } = useContext(AdaptContext);
  const componentRefs = useRef();
  componentRefs.current = getComponentTreeRefs(
    elementInView === null ? [] : elements[elementInView],
  );

  if (elementInView === null) {
    return <Box sx={{ flex: 1, ...sx }}>No element selected to view</Box>;
  }

  const tree = [
    {
      key: 'background',
      value: [
        {
          cssValue: true,
          value: 'red',
          edit: false,
        },
        {
          cssValue: true,
          value: 'pink',
          edit: false,
        },
        {
          cssValue: true,
          value: 'yellow',
          edit: false,
        },
        {
          cssValue: true,
          value: 'green',
          edit: false,
        },
      ],
    },
    {
      key: 'color',
      value: {
        cssValue: true,
        value: 'yellow',
        edit: false,
      },
    },
    {
      key: 'h1',
      value: [
        {
          key: 'backgroundColor',
          value: {
            cssValue: true,
            value: 'yellow',
            edit: false,
          },
        },
        {
          key: 'a, span',
          value: [
            {
              key: 'backgroundColor',
              value: {
                cssValue: true,
                value: 'red',
                edit: false,
              },
            },
            {
              key: 'color',
              value: {
                cssValue: true,
                value: 'pink',
                edit: false,
              },
            },
          ],
        },
      ],
    },
  ];

  return (
    <Box sx={{ flex: 1, ...sx }}>
      <ComponentTree tree={elements[elementInView]} />
      <Box>
        <JSONEditor tree={tree} />
      </Box>
    </Box>
  );
}

export default Ui;

Ui.propTypes = {
  sx: PropTypes.shape({
    order: propTypes.flex.order,
  }),
};

Ui.defaultProps = {
  sx: undefined,
};
