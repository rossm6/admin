import {
  useEffect, useMemo, useReducer, useState,
} from 'react';
import { Box } from 'theme-ui';
import { gql, useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import Devtools from './devtools';
import Ui from './ui';
import { AdaptContext } from './contexts';
import usePrevious from '../hooks/usePrevious';
import AdaptComponent from './adaptComponent';

function useMainContainerStyles(devtoolsPosition) {
  const containerSx = { display: 'flex', height: '100vh' };
  const uiSx = {};
  if (devtoolsPosition === 'left' || devtoolsPosition === 'right') {
    containerSx.flexDirection = 'row';
    if (devtoolsPosition === 'left') {
      uiSx.order = 1;
    } else {
      uiSx.order = 0;
    }
  } else {
    containerSx.flexDirection = 'column';
    if (devtoolsPosition === 'top') {
      uiSx.order = 1;
    } else if (devtoolsPosition === 'bottom') {
      uiSx.order = 0;
    }
  }

  let containerCss = {};
  if (devtoolsPosition !== 'separate') {
    containerCss = {
      '.devtoolsWrapper': {
        position: 'relative !important',
        display: 'block !important',
        transform: 'none !important',
      },
    };
  }

  return [containerSx, containerCss, uiSx];
}

function addComponentToElement(elements, elementInView, newComponent) {
  const currentElements = elements;
  let element = currentElements[elementInView];
  element = {
    ...element,
    components: [
      ...element.components,
      {
        Component: AdaptComponent,
        props: {
          children: [],
          userSelected: {
            ...newComponent,
          },
        },
      },
    ],
  };
  currentElements[elementInView] = element;
  return currentElements;
}

function adaptReducer(state, action) {
  switch (action.type) {
    case 'addComponentToElement':
      return {
        ...state,
        elements: addComponentToElement(
          state.elements,
          action.payload.elementInView,
          action.payload.newComponent,
        ),
      };
    case 'setDevtoolsPosition':
      return {
        ...state,
        devtoolsPosition: action.payload.devtoolsPosition,
      };
    case 'setElements':
      return {
        ...state,
        elements: action.payload.elements,
      };
    case 'elementInView':
      return {
        ...state,
        elementInView: action.payload.elementInView,
      };
    default:
      throw new Error();
  }
}

const SAVE_STATE = gql`
  mutation SAVE($state: String!) {
    saveState(state: $state) {
      success
    }
  }
`;

function prepareStateForSaving(state) {
  /**
   * TODO -
   * This removes functions of course.
   * So we must swap functions out for displayName
   */
  return JSON.stringify(state);
}

function Adapt({ initialState }) {
  const [state, dispatch] = useReducer(adaptReducer, initialState);
  const [sx, css, uiSx] = useMainContainerStyles(state.devtoolsPosition);
  const [saveState] = useMutation(SAVE_STATE);
  const previousState = usePrevious(state);

  useEffect(() => {
    if (previousState) {
      // i.e. do not save the initialState when Adapt first mounts!
      saveState({
        variables: {
          state: prepareStateForSaving(state),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState, state]);

  const adaptContext = useMemo(
    () => ({
      devtoolsPosition: state.devtoolsPosition,
      dispatch,
      elements: state.elements,
      elementInView: state.elementInView,
      setDevtoolsPosition: (devtoolsPosition) => dispatch({ type: 'setDevtoolsPosition', payload: { devtoolsPosition } }),
      setElements: (elements) => dispatch({ type: 'setElements', payload: { elements } }),
    }),
    [dispatch, state.devtoolsPosition, state.elements, state.elementInView],
  );

  return (
    <AdaptContext.Provider value={adaptContext}>
      <Box sx={sx} css={css}>
        <Ui sx={uiSx} />
        <Devtools />
      </Box>
    </AdaptContext.Provider>
  );
}

Adapt.propTypes = {
  initialState: PropTypes.shape({
    devtoolsPosition: PropTypes.string.isRequired,
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        components: PropTypes.arrayOf(
          PropTypes.shape({
            Component: PropTypes.elementType,
            // eslint-disable-next-line react/forbid-prop-types
            props: PropTypes.object,
          }),
        ),
      }),
    ),
  }).isRequired,
};

export default Adapt;
