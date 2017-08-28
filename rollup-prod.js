import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  entry: 'src/main.js',
  format: 'iife',
  moduleName: 'Cervus',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    closure(),
  ],
  dest: 'dist/cervus.min.js'
};
