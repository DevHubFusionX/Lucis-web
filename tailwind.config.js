/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0057FF',
          500: '#0057FF',
          hover: '#0047D9',
          light: '#E6EEFF',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          900: '#0A0A0A',
          800: '#141414',
          700: '#1E1E1E'
        },
        light: {
          DEFAULT: '#F5F7FA',
          100: '#F5F7FA',
          200: '#ECEFF3',
          300: '#E1E6EB'
        },
        success: {
          DEFAULT: '#16A34A',
          500: '#16A34A',
          bg: '#E9F7EC'
        },
        error: {
          DEFAULT: '#DC2626',
          500: '#DC2626',
          bg: '#FDECEC'
        },
        warning: {
          DEFAULT: '#CA8A04',
          600: '#CA8A04',
          bg: '#FFF7E5'
        }
      },
    },
  },
  plugins: [],
}