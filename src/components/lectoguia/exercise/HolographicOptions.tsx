
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

interface HolographicOptionsProps {
  options: string[];
  selectedOption: number | null;
  correctAnswerIndex: number;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
}

export const HolographicOptions: React.FC<HolographicOptionsProps> = ({
  options,
  selectedOption,
  correctAnswerIndex,
  showFeedback,
  onOptionSelect
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const isSelected = selectedOption === index;
        const isCorrect = index === correctAnswerIndex;
        const isWrong = showFeedback && isSelected && !isCorrect;
        const shouldHighlightCorrect = showFeedback && isCorrect;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            {/* Efecto glow de fondo */}
            <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 transition-all duration-500 ${
              shouldHighlightCorrect ? 'bg-green-400' :
              isWrong ? 'bg-red-400' :
              isSelected ? 'bg-primary' :
              'bg-transparent group-hover:bg-primary/20'
            }`} />
            
            {/* Botón principal con fondo más opaco */}
            <motion.button
              whileHover={{ scale: showFeedback ? 1 : 1.02, y: -2 }}
              whileTap={{ scale: showFeedback ? 1 : 0.98 }}
              onClick={() => !showFeedback && onOptionSelect(index)}
              disabled={showFeedback}
              className={`relative w-full p-6 rounded-2xl transition-all duration-300 border-2 ${
                shouldHighlightCorrect 
                  ? 'bg-green-500/30 border-green-400/70 shadow-green-400/25 shadow-lg backdrop-blur-md' :
                isWrong 
                  ? 'bg-red-500/30 border-red-400/70 shadow-red-400/25 shadow-lg backdrop-blur-md' :
                isSelected 
                  ? 'bg-primary/30 border-primary/70 shadow-primary/25 shadow-lg backdrop-blur-md' :
                  'bg-slate-800/90 dark:bg-slate-700/90 border-white/30 hover:border-primary/50 hover:bg-primary/20 backdrop-blur-md'
              } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* Partículas flotantes para opciones especiales */}
              {(shouldHighlightCorrect || isSelected) && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 rounded-full ${
                        shouldHighlightCorrect ? 'bg-green-400' : 'bg-primary'
                      }`}
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + Math.sin(i) * 20}%`
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Indicador de letra con fondo sólido */}
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  shouldHighlightCorrect 
                    ? 'bg-green-500 text-white shadow-green-400/50 shadow-lg' :
                  isWrong 
                    ? 'bg-red-500 text-white shadow-red-400/50 shadow-lg' :
                  isSelected 
                    ? 'bg-primary text-white shadow-primary/50 shadow-lg' :
                    'bg-slate-700 dark:bg-slate-600 text-white border-2 border-white/40'
                }`}>
                  {showFeedback ? (
                    shouldHighlightCorrect ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    ) : isWrong ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      letters[index]
                    )
                  ) : (
                    letters[index]
                  )}

                  {/* Anillo de efectos */}
                  {(shouldHighlightCorrect || isSelected) && (
                    <motion.div
                      className={`absolute inset-0 rounded-full border-2 ${
                        shouldHighlightCorrect ? 'border-green-400' : 'border-primary'
                      }`}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Texto de la opción con mejor contraste */}
                <div className="flex-1 text-left">
                  <p className={`font-medium leading-relaxed transition-colors duration-300 ${
                    shouldHighlightCorrect || isWrong || isSelected 
                      ? 'text-white' 
                      : 'text-white group-hover:text-white'
                  }`}>
                    {option}
                  </p>
                </div>

                {/* Indicador de selección activa */}
                {isSelected && !showFeedback && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="flex-shrink-0"
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>
                )}
              </div>

              {/* Borde luminoso animado */}
              {!showFeedback && (
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
                </div>
              )}
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
};
