
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface RoutingContext {
  subject?: string;
  nodeId?: string;
  testId?: string;
  fromTool?: string;
  data?: any;
}

export function useUnifiedRouting() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentTool, setCurrentTool] = useState(() => {
    // Extract tool from current path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'dashboard';
  });
  
  const [context, setContext] = useState<RoutingContext>({});

  // Update current tool when location changes
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const toolFromPath = pathSegments[0] || 'dashboard';
    
    if (toolFromPath !== currentTool) {
      setCurrentTool(toolFromPath);
    }

    // Extract context from URL params
    const params = new URLSearchParams(location.search);
    const subject = params.get('subject');
    const nodeId = params.get('nodeId');
    const testId = params.get('testId');
    
    if (subject || nodeId || testId) {
      setContext(prev => ({
        ...prev,
        ...(subject && { subject }),
        ...(nodeId && { nodeId }),
        ...(testId && { testId })
      }));
    }
  }, [location, currentTool]);

  const navigateToTool = useCallback((
    tool: string, 
    newContext?: RoutingContext
  ) => {
    console.log(`🧭 Routing: ${currentTool} → ${tool}`, { context: newContext });
    
    // Build new URL
    let newPath = `/${tool}`;
    const params = new URLSearchParams(location.search);
    
    // Update context
    if (newContext) {
      setContext(prev => ({ 
        ...prev, 
        ...newContext, 
        fromTool: currentTool 
      }));
      
      // Add context to URL params
      if (newContext.subject) params.set('subject', newContext.subject);
      if (newContext.nodeId) params.set('nodeId', newContext.nodeId);
      if (newContext.testId) params.set('testId', newContext.testId);
    }
    
    // Navigate to new route
    const queryString = params.toString();
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;
    
    navigate(fullPath);
    setCurrentTool(tool);
    
    console.log(`✅ Navegación completada a ${tool}`);
  }, [currentTool, location.search, navigate]);

  const updateContext = useCallback((newContext: Partial<RoutingContext>) => {
    setContext(prev => ({ ...prev, ...newContext }));
    
    // Update URL params
    const params = new URLSearchParams(location.search);
    if (newContext.subject) params.set('subject', newContext.subject);
    if (newContext.nodeId) params.set('nodeId', newContext.nodeId);
    if (newContext.testId) params.set('testId', newContext.testId);
    
    const queryString = params.toString();
    const newUrl = queryString ? `${location.pathname}?${queryString}` : location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [location]);

  return {
    currentTool,
    currentRoute: location.pathname,
    context,
    navigateToTool,
    updateContext
  };
}
