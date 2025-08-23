/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { motion } from "framer-motion";

import { supabase } from '../../integrations/supabase/leonardo-auth-client';
// Glass icons con efectos hologrÃ¡ficos para controles del dashboard
interface GlassIconItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  onClick?: () => void;
  customClass?: string;
}

interface HolographicGlassIconsProps {
  items: GlassIconItem[];
  className?: string;
}

const gradientMapping: Record<string, string> = {
  blue: "linear-gradient(135deg, hsl(223, 90%, 50%), hsl(208, 90%, 70%))",
  purple: "linear-gradient(135deg, hsl(283, 90%, 50%), hsl(268, 90%, 70%))",
  cyan: "linear-gradient(135deg, hsl(193, 90%, 50%), hsl(178, 90%, 70%))",
  green: "linear-gradient(135deg, hsl(123, 90%, 40%), hsl(108, 90%, 60%))",
  orange: "linear-gradient(135deg, hsl(43, 90%, 50%), hsl(28, 90%, 70%))",
  red: "linear-gradient(135deg, hsl(3, 90%, 50%), hsl(348, 90%, 70%))",
  emerald: "linear-gradient(135deg, hsl(158, 90%, 40%), hsl(143, 90%, 60%))",
  violet: "linear-gradient(135deg, hsl(258, 90%, 50%), hsl(243, 90%, 70%))"
};

export const HolographicGlassIcons = ({ 
  items, 
  className 
}: HolographicGlassIconsProps): JSX.Element => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div
      className={`grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mx-auto py-4 overflow-visible ${
        className || ""
      }`}
    >
      {items.map((item, index) => (
        <motion.button
          key={index}
          type="button"
          aria-label={item.label}
          onClick={item.onClick}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1, 
            duration: 0.6,
            type: "spring",
            stiffness: 100 
          }}
          whileHover={{ 
            scale: 1.1, 
            rotateY: 15,
            z: 50
          }}
          whileTap={{ scale: 0.95 }}
          className={`relative bg-transparent outline-none w-16 h-16 [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
            item.customClass || ""
          }`}
        >
          {/* Holographic glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 dynamic-glow"
            data-bg-gradient={`radial-gradient(circle at center, ${
              gradientMapping[item.color]?.replace('135deg', '50%') || item.color
            }, transparent 70%)`}
            data-filter="blur(10px)"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.5 }}
            transition={{ duration: 0.3 }}
          />

          {/* Back layer with enhanced shadows */}
          <span
            className="absolute top-0 left-0 w-full h-full rounded-xl block transition-[opacity,transform] duration-300 ease-&lsqb;cubic-bezier(0.83,0,0.17,1)&rsqb; origin-[100%_100%] rotate-[8deg] group-hover:[transform:rotate(15deg)_translate3d(-0.3em,-0.3em,0.3em)] dynamic-back-layer"
            data-bg-color={item.color}
            data-box-shadow="0.3em -0.3em 0.5em hsla(223, 10%, 10%, 0.2), 0 0 20px rgba(0,255,255,0.1)"
          />

          {/* Front layer with glassmorphism */}
          <span
            className="absolute top-0 left-0 w-full h-full rounded-xl bg-white/10 transition-[opacity,transform] duration-300 ease-&lsqb;cubic-bezier(0.83,0,0.17,1)&rsqb; origin-[80%_50%] flex backdrop-blur-md transform group-hover:[transform:translateZ(1.5em)] dynamic-glass-layer"
            data-box-shadow="0 0 0 0.1em hsla(0, 0%, 100%, 0.4) inset, 0 8px 32px rgba(0,0,0,0.3)"
            data-bg-gradient="linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
          >
            {/* Icon with enhanced styling */}
            <span
              className="m-auto w-6 h-6 flex items-center justify-center text-white group-hover:text-cyan-300 transition-colors duration-300"
              aria-hidden="true"
            >
              {React.cloneElement(item.icon, {
                className: "w-6 h-6 drop-shadow-lg"
              })}
            </span>

            {/* Holographic particles */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 dynamic-particle"
                  data-left={`${20 + i * 25}%`}
                  data-top={`${30 + i * 20}%`}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </span>

          {/* Enhanced label with glow */}
          <motion.span
            className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-xs opacity-0 transition-[opacity,transform] duration-300 ease-&lsqb;cubic-bezier(0.83,0,0.17,1)&rsqb; translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)] text-white group-hover:text-cyan-300 font-medium dynamic-text-glow"
            data-text-shadow="0 0 10px rgba(0,255,255,0.5)"
          >
            {item.label}
          </motion.span>

          {/* Neural connection lines */}
          <motion.div
            className="absolute top-1/2 left-full w-8 h-px bg-gradient-to-r from-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
          />
        </motion.button>
      ))}
    </div>
  );
};



