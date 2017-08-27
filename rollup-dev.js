import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  entry: 'src/main.js',
  format: 'umd',
  moduleName: 'Cervus',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      // open: true,
      contentBase: ['example', 'dist']
    }),
    livereload({
      watch: ['dist', 'example']
    })
  ],
  // external: [], // external shit goes here
  dest: 'dist/cervus.js'
};
