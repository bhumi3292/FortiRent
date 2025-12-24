// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#004F5D', // Midnight Teal
                    hover: '#003A45',
                    light: '#006C7F', // Added for gradients/accents
                },
                secondary: {
                    DEFAULT: '#00D4FF', // Cyan
                    hover: '#00B8E0',
                    dim: 'rgba(0, 212, 255, 0.1)', // For technical backgrounds
                },
                background: {
                    DEFAULT: '#EAEAEA',
                    paper: '#F5F5F5',
                    dark: '#1A1A1A', // For footer/dark sections
                },
                text: {
                    main: '#2C2C2C', // Dark Charcoal
                    muted: '#555555',
                    inverted: '#FFFFFF',
                },
                state: {
                    error: '#FF4D4D',
                    success: '#00C853',
                    warning: '#FFD600',
                    info: '#2979FF',
                },
            },
            fontFamily: {
                heading: ['Poppins', 'Montserrat', 'sans-serif'],
                body: ['Roboto', 'Open Sans', 'sans-serif'],
                mono: ['Fira Code', 'monospace'], // Added for technical feel
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                bounceSlow: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(10px)' },
                },
                textGlow: {
                    '0%, 100%': { 'text-shadow': '0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(0,79,93,0.3)' },
                    '50%': { 'text-shadow': '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(0,79,93,0.6)' },
                },
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in-up-delay-200': 'fadeInUp 0.8s ease-out 0.2s forwards',
                'fade-in-up-delay-400': 'fadeInUp 0.8s ease-out 0.4s forwards',
                'fade-in-up-delay-600': 'fadeInUp 0.8s ease-out 0.6s forwards',
                'bounce-slow': 'bounceSlow 2s infinite',
                'text-glow-subtle': 'textGlow 2s infinite ease-in-out',
            }
        },
    },
    plugins: [],
}