import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ReshetComponents',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles'
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@base-ui/react',
        '@base-ui/react/input',
        'clsx',
        'date-fns',
        'lucide-react',
        'react-day-picker',
        'react-day-picker/locale',
        'react-hot-toast',
        'remeda'
      ]
    }
  },
  server: {
    port: 1574
  }
});
