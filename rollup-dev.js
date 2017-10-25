import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'index.js',
  output: {
    file: 'dist/cervus.js',
    format: 'iife',
    name: 'Cervus',
  },
  plugins: [
    resolve(),
    serve({
      // open: true,
      contentBase: ['_example', 'dist']
    }),
    livereload({
      watch: ['dist', '_example']
    }),
    json(),
    commonjs({
      include: 'node_modules/**',  // Default: undefined
      extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]
      ignoreGlobal: false,  // Default: false
      sourceMap: false  // Default: true
    })
  ],
};
