import { Box, Button, IconButton } from 'theme-ui';
import PropTypes, { element } from 'prop-types';
import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import isObject from 'lodash.isobject';
import clone from 'lodash.clone';
import { isString } from 'lodash';
import get from 'lodash.get';
import propTypes from '../propTypes';
import { AdaptContext } from './contexts';
import RecursiveComponentTree from './componentTree';

function ComponentTree(element) {
  if (!element?.components?.length) {
    return <Box>This element contains no components</Box>;
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
      {elementInView >= 0 ? (
        <ComponentTree tree={elements[elementInView]} />
      ) : (
        <Box>No element selected to inspect</Box>
      )}
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
