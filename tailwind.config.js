/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E5F7FF',
          100: '#CCEFFF',
          200: '#99DFFF',
          300: '#66CFFF',
          400: '#33BFFF',
          500: '#00BFFF',
          600: '#00A3E0',
          700: '#0080B3',
          800: '#005F86',
          900: '#004060',
        },
        accent: {
          50: '#FFF5F0',
          100: '#FFEBE1',
          200: '#FFD7C3',
          300: '#FFC3A5',
          400: '#FFAF87',
          500: '#FF7F50',
          600: '#E66B3C',
          700: '#CC5728',
          800: '#B34314',
          900: '#993300',
        },
      },
    },
  },
  plugins: [],
};
