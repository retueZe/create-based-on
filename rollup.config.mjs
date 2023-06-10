import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import * as path from 'node:path'

const EXTERNAL = [
    'minimist', 'chalk', 'tar', 'prompts', 'project-factory',
    'node:fs/promises', 'node:path', 'node:fs', 'node:stream'
]

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
        external: EXTERNAL
    }
}

/** @type {import('rollup').RollupOptions} */
const config = {
    output: {
        dir: 'dist',
        entryFileNames: createEntryFileNames('.js'),
        chunkFileNames: '.chunks/[name]-[hash].js',
        format: 'esm'
    },
    plugins: [
        typescript(),
        terser({ecma: 2020})
    ]
}
export default applyDefaultConfig(config)
