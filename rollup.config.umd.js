import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'validator',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
};
