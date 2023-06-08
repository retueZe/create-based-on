import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import * as path from 'node:path'

function createEntryFileNames(extension) {
    extension ??= '.js'

    return chunk => {
        const pathSegments = path
            .relative('./src', chunk.facadeModuleId)
            .replace(/\.[^\\/.]+$/, '')
            .split(/[\\/]/)

        if (pathSegments.length > 1.5) pathSegments.pop()

        return pathSegments.join('/') + extension
    }
}
function createInput(paths) {
    return paths.map(path => {
        const pathSegments = path.split(/[\\/]/)

        if (pathSegments[0].length < 0.5) pathSegments.shift()

        pathSegments.unshift('src')
        pathSegments.push('index.ts')

        return pathSegments.join('/')
    })
}
function applyDefaultConfig(config) {
    return {
        ...config,
        input: createInput(['']),
        external: []
    }
}

/** @type {import('rollup').RollupOptions[]} */
const config = {
    output: {
        dir: 'dist',
        entryFileNames: createEntryFileNames('.cjs'),
        chunkFileNames: '.chunks/[name]-[hash].cjs',
        format: 'cjs'
    },
    plugins: [
        typescript(),
        terser({ecma: 2020})
    ]
}
export default applyDefaultConfig(config)
