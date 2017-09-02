import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

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
    })
  ],
};
