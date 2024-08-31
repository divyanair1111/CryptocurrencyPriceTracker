/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JavaScript, JSX, TypeScript, and TSX files in the src directory
    './public/index.html', // Include your main HTML file
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette if needed
        brand: {
          light: '#3fbaeb',
          DEFAULT: '#0fa9e6',
          dark: '#0c87b8',
        },
      },
      fontFamily: {
        // Custom font families if needed
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        // Custom spacing values if needed
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        // Custom border radius values if needed
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: Tailwind CSS Forms plugin for better form styling
    require('@tailwindcss/typography'), // Optional: Tailwind CSS Typography plugin for better typography
  ],
};
