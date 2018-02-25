import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'tinyMoment',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify({}),
  ],
};
