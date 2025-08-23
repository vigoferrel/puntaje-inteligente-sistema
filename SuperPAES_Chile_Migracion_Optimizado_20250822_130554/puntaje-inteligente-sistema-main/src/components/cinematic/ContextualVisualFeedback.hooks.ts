/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';

export const useVisualFeedback = () => {
  const { actions } = useAdvancedNeuralSystem();

  const showFeedback = (message: string, type: FeedbackNotification['type'] = 'info') => {
    actions.captureEvent('interaction', {
      type: 'manual_feedback',
      message,
      feedback_type: type,
      timestamp: Date.now()
    });

    // AquÃ­ se podrÃ­a integrar con un sistema de notificaciones global
    console.log(`ðŸŽ¯ Feedback: ${message} (${type})`);
  };

  return { showFeedback };
};



