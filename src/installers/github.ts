import { fileInstaller } from './file.js'
import type { ITemplate } from 'project-factory'
import { verboseFetch } from '../verboseFetch.js'
import chalk from 'chalk'
import { extractTarball } from '../extractTarball.js'

export async function githubInstaller(archievePath: string, directory: string): Promise<ITemplate> {
    const response = await(await verboseFetch(`https://api.github.com/repos/${archievePath}`)).json()

    if ('message' in response) throw new Error('GitHub API error: ' + response.message)

    const defaultBranch = response.default_branch

    console.log(chalk.gray`Template was found at default branch {cyan ${defaultBranch}}.`)

    const tarResponse = await verboseFetch(`https://github.com/${archievePath}/tarball/${defaultBranch}`)

    if (!tarResponse.ok) throw new Error('GitHub API error: ' + (await tarResponse.json()).message)

    await extractTarball(tarResponse.body!, directory)

    return await fileInstaller(directory, directory)
}
