import type { ITemplate } from 'project-factory'
import { extractTarball } from '../extractTarball.js'
import { verboseFetch } from '../verboseFetch.js'
import { fileScaffolder } from './file.js'

export async function httpScaffolder(
    address: string,
    directory: string,
    secure?: boolean | null
): Promise<ITemplate> {
    secure ??= false
    const url = 'http' +
        (secure ? 's:' : ':') +
        address

    const response = await verboseFetch(url)

    if (!response.ok) throw new Error('HTTP error: ' + response.statusText)

    await extractTarball(response.body!, directory)

    return await fileScaffolder(directory, directory)
}
