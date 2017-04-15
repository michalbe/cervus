import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  dest: 'dist/bundle.js' // equivalent to --output
};
