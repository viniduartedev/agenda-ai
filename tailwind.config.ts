import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tenant: {
          primary: 'var(--tenant-primary)',
          soft: 'var(--tenant-primary-soft)',
          text: 'var(--tenant-text)',
        },
      },
      boxShadow: {
        panel: '0 20px 45px -24px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
