import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.esm.js',
    format: 'es',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify({}, minify),
  ],
};
