import { Box } from 'theme-ui';
import PropTypes from 'prop-types';
import { useContext, useRef } from 'react';
import propTypes from '../propTypes';
import { AdaptContext } from './contexts';
import RecursiveComponentTree from './componentTree';

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

function Ui({ sx }) {
  const { elements, elementInView } = useContext(AdaptContext);
  const componentRefs = useRef();
  componentRefs.current = getComponentTreeRefs(
    elementInView === null ? [] : elements[elementInView],
  );

  if (elementInView === null) {
    return <Box sx={{ flex: 1, ...sx }}>No element selected to view</Box>;
  }

  return (
    <Box sx={{ flex: 1, ...sx }}>
      <ComponentTree tree={elements[elementInView]} />
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
