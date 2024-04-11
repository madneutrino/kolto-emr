import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
  },
  resolve: {
    alias: {
      // We will use these from npm, and then override code if necessary.
      // '@medplum/core': path.resolve(__dirname, '../../packages/core/src'),
      // '@medplum/react': path.resolve(__dirname, '../../packages/react/src'),
    },
  },
});
