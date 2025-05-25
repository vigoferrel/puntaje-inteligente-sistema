
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UnifiedAppProvider } from '@/contexts/UnifiedAppProvider';
import { SuperContextProvider } from '@/contexts/SuperContext';
import { CinematicThemeProvider } from '@/contexts/CinematicThemeProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="font-luxury antialiased">
      <UnifiedAppProvider>
        <SuperContextProvider>
          <CinematicThemeProvider>
            <ThemeProvider>
              <RouterProvider router={router} />
              <Toaster />
            </ThemeProvider>
          </CinematicThemeProvider>
        </SuperContextProvider>
      </UnifiedAppProvider>
    </div>
  );
}

export default App;
