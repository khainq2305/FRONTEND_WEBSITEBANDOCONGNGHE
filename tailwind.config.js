/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1CA7EC',        
        secondary: '#0047AB',  
        'text-primary': '#FFFFFF',
        'text-secondary': '#1CA7EC'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
