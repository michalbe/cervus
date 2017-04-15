import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  entry: 'src/main.js',
  format: 'umd',
  moduleName: 'CERVUS',
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      open: true,
      contentBase: ['example', 'dist']
    }),
    livereload()
  ],
  // external: [], // external shit goes here
  dest: 'dist/cervus.js'
};
