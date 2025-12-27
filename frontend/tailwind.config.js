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
                    DEFAULT: '#1F6F8B', // Deep Teal/Blue
                    hover: '#185a70',
                    light: '#e0eff5', // Very light tint for backgrounds
                },
                secondary: {
                    DEFAULT: '#F4A261', // Warm Sandy Orange
                    hover: '#e78c43',
                },
                background: {
                    DEFAULT: '#F7F9FC', // Very Light Blue/Grey
                    paper: '#FFFFFF',
                    dark: '#2D2D2D',
                },
                text: {
                    main: '#2D2D2D', // Dark Grey
                    muted: '#6c757d',
                    inverted: '#FFFFFF',
                },
                state: {
                    error: '#E63946',
                    success: '#2a9d8f',
                    warning: '#e9c46a',
                    info: '#1F6F8B',
                },
            },
            fontFamily: {
                heading: ['Poppins', 'Montserrat', 'sans-serif'],
                body: ['Roboto', 'Open Sans', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'soft-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
                'card': '0 2px 12px rgba(0,0,0,0.08)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}