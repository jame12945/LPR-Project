/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,t s,jsx,tsx,mdx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      purple: '#3f3cbb',
      ocenblue: '#172554',
      metal: '#565584',
      tahiti: '#3ab7bf',
      silver: '#ecebff',
      black: '#000000',
      blue: '#60a5fa',
      'bubble-gum': '#ff77e9',
      bermuda: '#78dcca',
      green: '#22c55e',
      sky: '#bae6fd',
      rain: '#312e81',
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
export default config
