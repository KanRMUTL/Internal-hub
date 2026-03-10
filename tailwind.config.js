module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#008472',
          focus: '#005a4f',
        },
        secondary: {
          DEFAULT: '#1b7ab8',
        },
        success: {
          DEFAULT: '#1e8a42',
        },
        danger: {
          DEFAULT: '#d31d43',
        },
        warning: {
          DEFAULT: '#856404',
          bg: '#ffdd57',
        },
        surface: {
          light: '#F5F6F8',
          dark: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}
