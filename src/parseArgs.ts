import minimist from 'minimist'

export type Args = {
    templateLocation: string
    prefix: string
}

export function parseArgs(): Args {
    const args = minimist(process.argv.slice(2))
    let position = 0

    return {
        templateLocation: args['template']
            ?? args['t']
            ?? args._[position++]
            ?? null,
        prefix: args['prefix']
            ?? args['p']
            ?? args._[position++]
            ?? '.'
    }
}
