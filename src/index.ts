import minimist from 'minimist'
import { install } from './install'
import chalk from 'chalk'
import { resolve } from 'node:path'

export default async function main(): Promise<void> {
    try {
        const argv = minimist(process.argv.slice(2))
        const templateLocation = argv._[0] ?? null
        const installDirectory = resolve(argv._[1] ?? '.')

        if (templateLocation === null) throw new Error('No template location provided.')

        console.log(chalk.bold(`Installing "${templateLocation}" to "${installDirectory}"...`))

        await install(templateLocation, installDirectory)

        console.log(chalk.bold('Template has been successfully installed.'))
    } catch (error: any) {
        if (typeof error !== 'object' || error === null) throw error
        if (!('message' in error)) throw error

        throw error
        // console.log(chalk.red('Initialization failed: ' + error.message))
    }
}
