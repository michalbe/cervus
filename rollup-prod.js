import resolve from 'rollup-plugin-node-resolve';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: 'index.js',
  output: {
    file: 'dist/cervus.min.js',
    format: 'iife',
    name: 'Cervus',
  },
  plugins: [
    resolve(),
    closure(),
  ],
};
