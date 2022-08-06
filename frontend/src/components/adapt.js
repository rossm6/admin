import { useMemo, useState } from 'react';
import { Box } from 'theme-ui';
import Devtools from './devtools';
import Ui from './ui';
import { AdaptContext } from './contexts';

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

function Adapt() {
  const [devtoolsPosition, setDevtoolsPosition] = useState('right');
  const [sx, css, uiSx] = useMainContainerStyles(devtoolsPosition);

  const adaptContext = useMemo(
    () => ({
      devtoolsPosition,
      setDevtoolsPosition,
    }),
    [devtoolsPosition, setDevtoolsPosition],
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

export default Adapt;
