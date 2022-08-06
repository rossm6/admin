import {
  Box, Card, Flex, Button, Heading,
} from 'theme-ui';
import { Rnd } from 'react-rnd';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ThreeDots from '../icons/threeDots.svg';
import { Dropdown, DropdownMenu } from './dropdown';
import Check from '../icons/check.svg';
import { AdaptContext } from './contexts';
import propTypes from '../propTypes';
import CSS from '../css';

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;

const dropdownItemSx = {
  px: 4,
  py: 2,
  textAlign: 'left',
  '&:hover': { bg: 'haze' },
};

function getPositionDropdownItemOnClickHandler(
  setDevtoolsPosition,
  setDevtoolsState,
  devtoolsState,
) {
  return (newPosition, newStateProps) => {
    setDevtoolsPosition(newPosition);
    setDevtoolsState({
      ...devtoolsState,
      ...newStateProps,
      key: devtoolsState.key + 1,
    });
  };
}

function PositionMenu({
  devtoolsState,
  devtoolsPosition,
  setDevtoolsPosition,
  setDevtoolsState,
  setShowDevtoolsPositionDropdown,
  showDevtoolsPositionDropdown,
}) {
  const dropdownItemOnClickHandler = getPositionDropdownItemOnClickHandler(
    setDevtoolsPosition,
    setDevtoolsState,
    devtoolsState,
  );

  useEffect(() => {
    const hideDropdown = () => setShowDevtoolsPositionDropdown(false);
    window.addEventListener('click', hideDropdown);
    return () => {
      window.removeEventListener('click', hideDropdown);
    };
  }, [setShowDevtoolsPositionDropdown]);

  return (
    <DropdownMenu>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setShowDevtoolsPositionDropdown(!showDevtoolsPositionDropdown);
        }}
        variant="icon"
        sx={{ height: 'auto', width: 'auto', borderRadius: 0 }}
      >
        <ThreeDots />
      </Button>
      <Dropdown
        show={showDevtoolsPositionDropdown}
        position={devtoolsPosition === 'left' ? 'right' : 'left'}
      >
        <Card variant="dropdown" sx={{ bg: 'white', minWidth: 200, zIndex: 1 }}>
          <Box
            onClick={() => dropdownItemOnClickHandler('left', {
              width: 300,
              minWidth: MIN_WIDTH,
              height: '100%',
            })}
            sx={dropdownItemSx}
          >
            <Check style={{ visibility: devtoolsPosition === 'left' ? 'visible' : 'hidden' }} />
            Dock to left
          </Box>
          <Box
            onClick={() => dropdownItemOnClickHandler('right', {
              width: 300,
              minWidth: MIN_WIDTH,
              height: '100%',
            })}
            sx={dropdownItemSx}
          >
            <Check style={{ visibility: devtoolsPosition === 'right' ? 'visible' : 'hidden' }} />
            Dock to right
          </Box>
          <Box
            onClick={() => dropdownItemOnClickHandler('separate', {
              width: '50%',
              minWidth: MIN_WIDTH,
              minHeight: MIN_HEIGHT,
              height: '50%',
              x: 0,
              y: 0,
            })}
            sx={dropdownItemSx}
          >
            <Check style={{ visibility: devtoolsPosition === 'separate' ? 'visible' : 'hidden' }} />
            Separate window
          </Box>
        </Card>
      </Dropdown>
    </DropdownMenu>
  );
}

PositionMenu.propTypes = {
  devtoolsState: PropTypes.shape({
    width: propTypes.sizes.width,
    height: propTypes.sizes.height,
    key: PropTypes.number,
  }).isRequired,
  devtoolsPosition: PropTypes.string.isRequired,
  setDevtoolsPosition: PropTypes.func.isRequired,
  setDevtoolsState: PropTypes.func.isRequired,
  setShowDevtoolsPositionDropdown: PropTypes.func.isRequired,
  showDevtoolsPositionDropdown: PropTypes.bool.isRequired,
};

function getDevtoolsSxProp(devtoolsPosition) {
  const devtoolsSx = {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'haze',
  };
  if (devtoolsPosition === 'right') {
    devtoolsSx.borderRight = 0;
    devtoolsSx.borderTop = 0;
    devtoolsSx.borderBottom = 0;
  } else if (devtoolsPosition === 'left') {
    devtoolsSx.borderLeft = 0;
    devtoolsSx.borderTop = 0;
    devtoolsSx.borderBottom = 0;
  }
  return devtoolsSx;
}

function getEnableResizingProp(devtoolsPosition) {
  const enableResizing = {
    top: false,
    right: false,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };
  if (devtoolsPosition === 'left') {
    enableResizing.right = true;
  } else if (devtoolsPosition === 'right') {
    enableResizing.left = true;
  } else if (devtoolsPosition === 'separate') {
    Object.keys(enableResizing).forEach((dir) => {
      enableResizing[dir] = true;
    });
  }
  return enableResizing;
}

const selectedTabSxProps = {
  borderTopColor: 'blue',
  borderStyle: 'solid',
  borderWidth: 2,
  borderRight: 0,
  borderBottom: 0,
  borderLeft: 0,
  color: 'blue',
  ...CSS.userSelect('none'),
};

const unselectedTabSxProps = {
  ...selectedTabSxProps,
  borderTopColor: 'haze',
  color: 'black',
};

function Tabs({ tabs, tab: selectedTab, setTab }) {
  return (
    <Flex>
      {tabs.map((tab) => (
        <Box
          sx={{
            bg: 'haze',
            px: 2,
            py: 1,
            cursor: 'pointer',
            ...(tab === selectedTab ? selectedTabSxProps : unselectedTabSxProps),
          }}
          key={tab}
          onClick={() => setTab(tab)}
        >
          {tab}
        </Box>
      ))}
    </Flex>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  tab: PropTypes.string.isRequired,
  setTab: PropTypes.func.isRequired,
};

const tabs = ['Inspector', 'Todo'];

function Inspector() {
  return (
    <Box>
      <Box>rnd box here</Box>
      <Box>side panel</Box>
    </Box>
  );
}

function Devtools() {
  const { devtoolsPosition, setDevtoolsPosition } = useContext(AdaptContext);
  const [showDevtoolsPositionDropdown, setShowDevtoolsPositionDropdown] = useState(false);
  const [devtoolsState, setDevtoolsState] = useState({
    width: 300,
    height: '100%',
    key: 1,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
  });
  const [tab, setTab] = useState(tabs[0]);

  const devtoolsSx = getDevtoolsSxProp(devtoolsPosition);
  const enableResizing = getEnableResizingProp(devtoolsPosition);

  return (
    <Rnd
      bounds="parent"
      enableResizing={enableResizing}
      disableDragging={devtoolsPosition !== 'separate'}
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
      <Flex
        className="devtools"
        sx={{
          height: '100%',
          width: '100%',
          minWidth: devtoolsState.minWidth,
          minHeight: devtoolsState.minHeight,
          p: 2,
          flexDirection: 'column',
          ...devtoolsSx,
        }}
      >
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Tabs tab={tab} tabs={tabs} setTab={setTab} />
          <PositionMenu
            devtoolsPosition={devtoolsPosition}
            devtoolsState={devtoolsState}
            setDevtoolsPosition={setDevtoolsPosition}
            setShowDevtoolsPositionDropdown={setShowDevtoolsPositionDropdown}
            setDevtoolsState={setDevtoolsState}
            showDevtoolsPositionDropdown={showDevtoolsPositionDropdown}
          />
        </Flex>
        <Box sx={{ flex: 1, py: 2 }}>{tab === 'Inspector' && <Inspector />}</Box>
      </Flex>
    </Rnd>
  );
}

export default Devtools;
