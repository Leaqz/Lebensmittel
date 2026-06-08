/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        apple: {
          bg:     '#F5F5F7',
          card:   '#FFFFFF',
          fill:   '#F2F2F7',
          fill2:  '#E5E5EA',
          fill3:  '#D1D1D6',
          l1:     '#1D1D1F',
          l2:     '#6E6E73',
          l3:     '#AEAEB2',
          green:  '#30D158',
          red:    '#FF3B30',
          blue:   '#007AFF',
          orange: '#FF9500',
          yellow: '#FFD60A',
        },
      },
      boxShadow: {
        apple:       '0 0 0 0.5px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07)',
        'apple-sm':  '0 0 0 0.5px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.05)',
        'apple-lg':  '0 0 0 0.5px rgba(0,0,0,0.04), 0 8px 40px rgba(0,0,0,0.12)',
        'apple-green':'0 0 0 1.5px #30D158, 0 8px 32px rgba(48,209,88,0.18)',
      },
    },
  },
  plugins: [],
};
