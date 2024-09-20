/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Add paths to all your template files here
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-gradient-start': '#1a2e4f',
        'custom-gradient-end': '#0e101d',
        'button-blue': '#4c6ef5',
        'button-purple': '#a29bfe',
        'header-text': '#ccd6f6',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(45deg, #1a2e4f, #0e101d)',
      },
      keyframes: {
        'gradient-animation': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      animation: {
        gradient: 'gradient-animation 10s ease infinite',
      },
      boxShadow: {
        'blue-glow': '0 4px 30px rgba(0, 123, 255, 0.7)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),

  ],
}
