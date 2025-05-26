
import React from 'react'
import ReactDOM from 'react-dom/client'
import { OptimizedProviderTree } from "@/providers/OptimizedProviderTree";
import { UnifiedSystemContainer } from "@/components/unified-system/UnifiedSystemContainer";
import './index.css'

const App = () => (
  <OptimizedProviderTree>
    <UnifiedSystemContainer />
  </OptimizedProviderTree>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
