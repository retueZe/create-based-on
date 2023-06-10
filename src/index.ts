import { install } from './install'
import chalk from 'chalk'
import { parseArgs } from './parseArgs'

export default async function main(): Promise<void> {
    try {
        const {templateLocation, installDirectory} = parseArgs()

        if (templateLocation === null) throw new Error('No template location provided.')

        console.log(chalk`Installing {cyan ${templateLocation}} to {green ${installDirectory}}...`)

        const template = await install(templateLocation, installDirectory)

        console.log(chalk`Template {cyan ${template.name}} has been successfully installed.`)
    } catch (error: any) {
        if (typeof error !== 'object' || error === null) throw error
        if (!('message' in error)) throw error

        if (process.env.NODE_ENV === 'development') throw error

        console.log(chalk.red('Initialization failed: ' + error.message))

        process.exit(1)
    }
}
