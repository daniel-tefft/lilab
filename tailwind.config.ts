import type { Config } from 'tailwindcss';

/**
 * Design tokens from the build spec (§2). The silver "identity" lives in the
 * metallic shading of the 3D structures, NOT in flat grey UI fills — so these
 * tokens stay restrained: deep voids, chrome text, a single laser accent.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0A0B0D',
        carbon: '#14161A',
        chrome: '#C9CDD3',
        'chrome-bright': '#F2F4F7',
        steel: '#6B7280',
        accent: '#3B82F6',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        hud: '0.18em',
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionTimingFunction: {
        // expressive eases used across reveals
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quint': 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
      keyframes: {
        'hud-flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.6' },
          '94%': { opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'hud-flicker': 'hud-flicker 6s linear infinite',
        'fade-in': 'fade-in 0.8s var(--ease-out-expo, ease) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
