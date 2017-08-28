import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: './src/main.js',
  output: {
    file: 'dist/cervus.min.js',
    format: 'iife',
    name: 'Cervus',
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    closure(),
  ],
};
