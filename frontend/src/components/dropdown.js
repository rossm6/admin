import { Box } from 'theme-ui';
import React from 'react';
import PropTypes from 'prop-types';
import propTypes from '../propTypes';

export function Dropdown({
  children, buttonHeight, maxWidth, position, show, width,
}) {
  if (!show) return null;

  let translationX = '0px';
  if (position) {
    if (position === 'left') {
      translationX = '-100%';
    } else if (position === 'right') {
      translationX = '0px';
    }
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: '0px auto auto 0px',
        m: 0,
        transform: `translate(${translationX}, ${buttonHeight}px)`,
        zIndex: 10000,
        width,
        maxWidth,
      }}
    >
      {children}
    </Box>
  );
}

Dropdown.propTypes = {
  children: PropTypes.node,
  buttonHeight: propTypes.sizes.height,
  maxWidth: propTypes.sizes.maxWidth,
  position: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  width: propTypes.sizes.width,
};

Dropdown.defaultProps = {
  buttonHeight: 40,
  children: undefined,
  maxWidth: 300,
  width: undefined,
};

export function DropdownMenu({ children, show, showProp }) {
  const sx = {
    position: 'relative',
  };

  if (show) {
    if (showProp === 'display') {
      sx[showProp] = 'block';
    } else {
      sx[showProp] = 'visible';
    }
  } else if (showProp === 'display') {
    sx[showProp] = 'none';
  } else {
    sx[showProp] = 'hidden';
  }

  return <Box sx={sx}>{children}</Box>;
}

DropdownMenu.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
  showProp: PropTypes.string,
};

DropdownMenu.defaultProps = {
  children: undefined,
  show: true,
  showProp: 'display',
};
