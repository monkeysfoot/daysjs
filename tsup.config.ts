import { defineConfig } from 'tsup'

export default defineConfig({
    target: 'es2022',
    format: ['cjs', 'esm'],
    sourcemap: true,
    clean: true,
    dts: true
})