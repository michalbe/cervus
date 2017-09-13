import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: 'index.js',
  output: {
    file: 'dist/cervus.min.js',
    format: 'iife',
    name: 'Cervus',
  },
  plugins: [
    resolve(),
    minify({ comments: false }),
  ],
};
