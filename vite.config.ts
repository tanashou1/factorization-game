import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages用: '/factorization-game/', Capacitor(Android)用: '/'
  base: process.env.VITE_BASE_URL ?? '/',
});
