import { Box } from 'theme-ui';
import PropTypes from 'prop-types';
import { useContext, useRef, useState } from 'react';
import isObject from 'lodash.isobject';
import propTypes from '../propTypes';
import { AdaptContext } from './contexts';
import RecursiveComponentTree from './componentTree';
import CaretRight from '../icons/caretRight.svg';

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

// [
//   {
//     key: 'background',
//     value: 'red',
//   },
//   {
//     key: 'color',
//     value: ['red', 'yellow'],
//   },
// ];

function CollapseButton({ open, setOpen }) {
  const sx = {
    cursor: 'pointer',
  };
  if (open) {
    sx.transform = 'rotate(90deg)';
  }
  return <CaretRight onClick={() => setOpen(!open)} style={sx} />;
}

function CollaspableNode({ path, tree }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: open ? 'column' : 'row' }}>
      <Box sx={{ whiteSpace: 'pre-wrap' }}>
        <CollapseButton open={open} setOpen={setOpen} />
        {tree.key}
        :
        {'   '}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: open ? 'column' : 'row',
          ml: open ? 4 : 0,
        }}
      >
        <JSONEditor path={path} tree={tree.value} />
      </Box>
    </Box>
  );
}

function JSONEditor({ path = [], tree }) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;

  if (Array.isArray(tree)) {
    return tree.map((node, index) => (
      <JSONEditor
        key={JSON.stringify([...path, [parentLevel + 1, index]])}
        path={[...path, [parentLevel + 1, index]]}
        tree={node}
      />
    ));
  }

  if (Array.isArray(tree?.value)) {
    if (Array.isArray(tree.value)) {
      return <CollaspableNode path={path} tree={tree} />;
    }
  }

  if (tree?.value !== undefined) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ whiteSpace: 'pre-wrap' }}>
          {tree.key}
          :
          {'   '}
        </Box>
        <Box>{tree.value}</Box>
      </Box>
    );
  }

  return <div>{tree}</div>;
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
      value: ['red', 'green', 'yellow', 'pink'],
    },
    {
      key: 'color',
      value: 'yellow',
    },
    {
      key: 'h1',
      value: [
        {
          key: 'backgroundColor',
          value: 'tomato',
        },
        {
          key: 'a, span',
          value: [
            {
              key: 'backgroundColor',
              value: 'white',
            },
            {
              key: 'color',
              value: 'tomato',
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
