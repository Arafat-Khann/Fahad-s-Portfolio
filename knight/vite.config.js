import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    lib: {
      entry: 'src/KnightScene.js',
      name: 'KnightScene',
      formats: ['es'],
      fileName: 'knight-scene',
    },
    rollupOptions: {
      external: ['three'],
      output: {
        globals: { three: 'THREE' },
      },
    },
  },
});
