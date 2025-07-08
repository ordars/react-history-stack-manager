import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

const external = [
  ...Object.keys(packageJson.peerDependencies || {}),
  'react/jsx-runtime',
];

const plugins = [
  resolve({
    browser: true,
  }),
  commonjs(),
  typescript({
    declaration: false,
    declarationMap: false,
  }),
];

export default [
  // ESM build
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom', 'uuid'],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        target: 'ES2020',
        module: 'ESNext',
      }),
    ],
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  },
  // CJS build
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom', 'uuid'],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        target: 'ES2020',
        module: 'ESNext',
      }),
    ],
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  },
  // UMD build
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom'],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        target: 'ES2020',
        module: 'ESNext',
      }),
    ],
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      sourcemap: true,
      name: 'ReactHistoryStackManager',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  },
  // Types
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
]; 