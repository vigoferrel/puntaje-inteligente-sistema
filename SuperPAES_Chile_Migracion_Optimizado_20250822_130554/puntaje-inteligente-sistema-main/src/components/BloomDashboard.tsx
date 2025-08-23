// ============================================================================
// 🎨 BLOOM JOURNEY REVOLUTION - DASHBOARD PRINCIPAL 🎨
// Creado por: ROO & OSCAR FERREL - Los Arquitectos del Futuro Educativo
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Search, 
  Wrench, 
  Eye, 
  Scale, 
  Palette,
  Trophy,
  Clock,
  Target,
  Star,
  ChevronRight,
  Play,
  Lock
} from 'lucide-react';
import { useBloom } from '../hooks/useBloom';
import { BLOOM_LEVEL_CONFIG } from '../types/bloom';
import type { BloomLevelId, BloomSubject, BloomProgress } from '../types/bloom';

// 🎨 Iconos por nivel
const LEVEL_ICONS = {
  L1: Brain,
  L2: Search,
  L3: Wrench,
  L4: Eye,
  L5: Scale,
  L6: Palette
};

// 🎯 Componente de tarjeta de nivel
