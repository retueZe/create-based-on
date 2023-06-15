import { scaffold } from './scaffold.js'
import chalk from 'chalk'
import { parseArgs } from './parseArgs.js'
import { resolve } from 'node:path'

export default async function main(): Promise<void> {
    try {
        const {templateLocation, prefix: prefix} = parseArgs()

        if (templateLocation === null) throw new Error('No template location provided.')

        const absolutePrefix = resolve(prefix)
        console.log(chalk`scaffolding {cyan ${templateLocation}} to {green ${absolutePrefix}}...`)

        await scaffold(templateLocation, prefix)

        console.log('Template has been successfully scaffolded.')
    } catch (error: any) {
        if (typeof error !== 'object' || error === null) throw error
        if (!('message' in error)) throw error

        if (process.env.NODE_ENV === 'development') throw error

        console.log(chalk.red('Initialization failed: ' + error.message))

        process.exit(1)
    }
}
