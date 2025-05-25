
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UnifiedAppProvider } from '@/contexts/UnifiedAppProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <UnifiedAppProvider>
        <RouterProvider router={router} />
        <Toaster />
      </UnifiedAppProvider>
    </ThemeProvider>
  );
}

export default App;
