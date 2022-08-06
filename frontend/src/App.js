import { ThemeProvider } from 'theme-ui';
import { BrowserRouter } from 'react-router-dom';
import { createContext, useMemo, useState } from 'react';
import clone from 'lodash.clone';
import defaultTheme from './theme';
import Adapt from './components/adapt';

const AppContext = createContext();

function App() {
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
          <Adapt />
        </BrowserRouter>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
