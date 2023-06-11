import { install } from './install.js'
import chalk from 'chalk'
import { parseArgs } from './parseArgs.js'
import { resolve } from 'node:path'

export default async function main(): Promise<void> {
    try {
        const {templateLocation, installDirectory} = parseArgs()

        if (templateLocation === null) throw new Error('No template location provided.')

        const absoluteInstallDirectory = resolve(installDirectory)
        console.log(chalk`Installing {cyan ${templateLocation}} to {green ${absoluteInstallDirectory}}...`)

        await install(templateLocation, installDirectory)

        console.log('Template has been successfully installed.')
    } catch (error: any) {
        if (typeof error !== 'object' || error === null) throw error
        if (!('message' in error)) throw error

        if (process.env.NODE_ENV === 'development') throw error

        console.log(chalk.red('Initialization failed: ' + error.message))

        process.exit(1)
    }
}
