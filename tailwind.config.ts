import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // True Flowy Design Tokens
      spacing: {
        // Generous, breathing spacing
        'flowy-xs': '0.75rem',   // 12px - minimal breathing room
        'flowy-sm': '1.25rem',   // 20px - comfortable space
        'flowy-md': '2rem',      // 32px - generous space  
        'flowy-lg': '3rem',      // 48px - spacious
        'flowy-xl': '4rem',      // 64px - very spacious
        'flowy-2xl': '6rem',     // 96px - luxurious space
        'flowy-3xl': '8rem',     // 128px - flowing rivers of space
      },
      
      borderRadius: {
        // Soft, organic curves like water-worn stones
        'flowy-sm': '1rem',      // 16px - gentle curves
        'flowy-md': '1.5rem',    // 24px - flowing curves
        'flowy-lg': '2rem',      // 32px - graceful curves
        'flowy-xl': '2.5rem',    // 40px - elegant curves
        'flowy-2xl': '3rem',     // 48px - cloud-like curves
      },
      
      boxShadow: {
        // Soft, weightless shadows like morning mist
        'flowy': '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'flowy-xs': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'flowy-sm': '0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
        'flowy-md': '0 8px 20px rgba(0, 0, 0, 0.06), 0 3px 6px rgba(0, 0, 0, 0.04)',
        'flowy-lg': '0 12px 28px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.05)',
        'flowy-xl': '0 16px 40px rgba(0, 0, 0, 0.10), 0 6px 12px rgba(0, 0, 0, 0.06)',
        'flowy-float': '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
        'flowy-dark': '0 4px 16px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.10)',
      },
      
      backdropBlur: {
        // Natural blur like looking through water
        'flowy': '8px',
        'flowy-xs': '4px',
        'flowy-sm': '8px', 
        'flowy-md': '12px',
        'flowy-lg': '16px',
        'flowy-xl': '24px',
      },
      
      animation: {
        // Gentle, water-like animations
        'flowy-float': 'flowyFloat 6s ease-in-out infinite',
        'flowy-drift': 'flowyDrift 8s ease-in-out infinite',
        'flowy-breathe': 'flowyBreathe 4s ease-in-out infinite',
      },
      
      keyframes: {
        flowyFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        flowyDrift: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(4px)' },
        },
        flowyBreathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      
      // Flowy design system variables
      backgroundColor: {
        'flowy-glass': 'var(--flowy-glass)',
        'flowy-glass-dark': 'var(--flowy-glass-dark)',
      },
      
      borderColor: {
        'flowy-border': 'var(--flowy-border)',
        'flowy-border-dark': 'var(--flowy-border-dark)',
      },
      
      // Flowy color palette - soft, natural tones
      colors: {
        flowy: {
          // Soft glass tones
          glass: {
            50: 'rgba(255, 255, 255, 0.95)',
            100: 'rgba(255, 255, 255, 0.90)',
            200: 'rgba(255, 255, 255, 0.80)',
            300: 'rgba(255, 255, 255, 0.70)',
            400: 'rgba(255, 255, 255, 0.60)',
            500: 'rgba(255, 255, 255, 0.50)',
            600: 'rgba(255, 255, 255, 0.40)',
            700: 'rgba(255, 255, 255, 0.30)',
            800: 'rgba(255, 255, 255, 0.20)',
            900: 'rgba(255, 255, 255, 0.10)',
          },
          
          // Natural water tones
          water: {
            50: 'rgba(239, 246, 255, 0.95)',
            100: 'rgba(219, 234, 254, 0.90)', 
            200: 'rgba(191, 219, 254, 0.80)',
            300: 'rgba(147, 197, 253, 0.70)',
            400: 'rgba(96, 165, 250, 0.60)',
            500: 'rgba(59, 130, 246, 0.50)',
          },
          
          // Soft earth tones
          earth: {
            50: 'rgba(250, 250, 249, 0.95)',
            100: 'rgba(245, 245, 244, 0.90)',
            200: 'rgba(231, 229, 228, 0.80)', 
            300: 'rgba(214, 211, 209, 0.70)',
            400: 'rgba(168, 162, 158, 0.60)',
            500: 'rgba(120, 113, 108, 0.50)',
          }
        },
        
        // Standard shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config; 