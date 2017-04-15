import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [ resolve({
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  }) ],
  // external: ['lodash'], // external shit goes here
  dest: 'dist/bundle.js'
};
