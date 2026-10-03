///workspaces/kren/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kren: {
          DEFAULT: '#5DBB3F',
          dark: '#4A9E32',
        },
      },
    },
  },
  plugins: [],
}
export default config