/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { QualitySystemWrapper } from '../quality/QualitySystemWrapper';

export const ModernWrapper: FC = () => {
  return <QualitySystemWrapper />;
};

