import { ThemeProvider } from 'theme-ui';
import { BrowserRouter } from 'react-router-dom';
import { createContext, useMemo, useState } from 'react';
import clone from 'lodash.clone';
import PropTypes from 'prop-types';
import defaultTheme from './theme';
import Adapt from './components/adapt';

const AppContext = createContext();

function App({ initialState }) {
  const [theme, setTheme] = useState(clone(defaultTheme));

  const appContextProvider = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme],
  );

  return (
    <AppContext.Provider value={appContextProvider}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Adapt initialState={initialState} />
        </BrowserRouter>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

App.propTypes = {
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

export default App;
