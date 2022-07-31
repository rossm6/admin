import {
  Box, Divider, Heading, jsx, ThemeProvider,
} from 'theme-ui';
import {
  BrowserRouter, Routes, Route, Link,
} from 'react-router-dom';
import { createContext, useMemo, useState } from 'react';
import clone from 'lodash.clone';
import FormDemo from './pages/demo/form';
import defaultTheme from './theme';

const AppContext = createContext();

function Home() {
  return (
    <Box>
      <Box>
        <Heading>Demos</Heading>
        <Link to="/admin/pages/demo/form">Form Demo</Link>
      </Box>
      <Divider />
    </Box>
  );
}

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
          <Routes>
            <Route path="/admin" element={<Home />} />
            <Route path="/admin/pages/demo/form" element={<FormDemo />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
