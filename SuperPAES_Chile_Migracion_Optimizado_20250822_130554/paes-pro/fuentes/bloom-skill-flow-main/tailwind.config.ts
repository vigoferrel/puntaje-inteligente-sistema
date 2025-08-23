
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Skillnest brand colors - Identidad visual oficial
				skillnest: {
					// Azul primario - Color dominante de la marca
					blue: {
						50: '#eff6ff',
						100: '#dbeafe', 
						200: '#bfdbfe',
						300: '#93c5fd',
						400: '#60a5fa',
						500: '#3b82f6', // Azul principal Skillnest
						600: '#2563eb', // Azul profundo para contraste
						700: '#1d4ed8',
						800: '#1e40af',
						900: '#1e3a8a'
					},
					// Verde/Turquesa - Color secundario del gradiente
					green: {
						50: '#f0fdf4',
						100: '#dcfce7',
						200: '#bbf7d0',
						300: '#86efac',
						400: '#4ade80',
						500: '#22c55e', // Verde/turquesa Skillnest
						600: '#16a34a',
						700: '#15803d',
						800: '#166534',
						900: '#14532d'
					},
					// Colores de apoyo para la identidad
					gray: {
						50: '#f9fafb',
						100: '#f3f4f6',
						200: '#e5e7eb',
						300: '#d1d5db',
						400: '#9ca3af',
						500: '#6b7280', // Gris para textos secundarios
						600: '#4b5563',
						700: '#374151',
						800: '#1f2937', // Negro para navegación
						900: '#111827'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Animaciones personalizadas Skillnest
				'skillnest-pulse': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.5'
					}
				},
				'skillnest-spin': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'skillnest-bounce': {
					'0%, 100%': {
						transform: 'translateY(-25%)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				// Animación de gradiente para elementos destacados
				'skillnest-gradient': {
					'0%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					},
					'100%': {
						backgroundPosition: '0% 50%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'skillnest-pulse': 'skillnest-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'skillnest-spin': 'skillnest-spin 1s linear infinite',
				'skillnest-bounce': 'skillnest-bounce 1s infinite',
				'skillnest-gradient': 'skillnest-gradient 3s ease infinite'
			},
			fontFamily: {
				// Tipografía oficial Skillnest
				'skillnest': ['Inter', 'Roboto', 'system-ui', 'sans-serif']
			},
			spacing: {
				// Espaciado consistente con la identidad Skillnest
				'skillnest-xs': '0.25rem',  // 4px
				'skillnest-sm': '0.5rem',   // 8px
				'skillnest-md': '1rem',     // 16px
				'skillnest-lg': '1.5rem',   // 24px
				'skillnest-xl': '2rem',     // 32px
				'skillnest-2xl': '3rem',    // 48px
				'skillnest-3xl': '4rem'     // 64px
			},
			backgroundImage: {
				// Gradientes oficiales de la marca Skillnest
				'skillnest-gradient': 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
				'skillnest-gradient-dark': 'linear-gradient(135deg, #1e40af 0%, #15803d 100%)',
				'skillnest-hero': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #22c55e 100%)'
			},
			boxShadow: {
				// Sombras consistentes con el diseño Skillnest
				'skillnest': '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
				'skillnest-lg': '0 20px 40px -10px rgba(59, 130, 246, 0.15), 0 8px 16px -4px rgba(59, 130, 246, 0.1)',
				'skillnest-green': '0 10px 25px -5px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
