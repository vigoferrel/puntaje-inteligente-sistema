
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LearningPlanProvider } from '@/contexts/LearningPlanContext';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LearningPlanProvider>
          <RouterProvider router={router} />
          <Toaster />
        </LearningPlanProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
