import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import commonjs from 'rollup-plugin-commonjs';

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
      contentBase: ['_example', 'dist']
    }),
    livereload({
      watch: ['dist', '_example']
    }),
    commonjs({
      include: 'node_modules/**',
      sourceMap: false
    })
  ],
};
