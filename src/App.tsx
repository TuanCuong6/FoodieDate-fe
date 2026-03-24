import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider, UIProvider, ThemeProvider } from './contexts';
import { AppRoutes } from './routes';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <UIProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </UIProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
