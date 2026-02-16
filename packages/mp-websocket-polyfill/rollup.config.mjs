import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.d.ts', format: 'es' },
    plugins: [del({ targets: './dist/*' }), dts()],
  },

  {
    input: 'src/index.ts',
    output: [
      { format: 'cjs', file: './dist/index.cjs.js' },
      { format: 'es', file: './dist/index.esm.js' },
    ],
    plugins: [typescript({ declaration: false })],
  },

  {
    input: 'src/text-codec-polyfill/index.ts',
    output: [
      { format: 'cjs', file: './dist/text-codec-polyfill/index.cjs.js' },
      { format: 'es', file: './dist/text-codec-polyfill/index.esm.js' },
    ],
    context: 'globalThis',
    plugins: [nodeResolve({ browser: true }), typescript({ declaration: false })],
  },
])
