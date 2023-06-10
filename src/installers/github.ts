import { fileInstaller } from './file'
import type { ITemplate } from 'project-factory'
import { verboseFetch } from '../verboseFetch'
import chalk from 'chalk'
import { extractTarball } from '../extractTarball'

export async function githubInstaller(archievePath: string, directory: string): Promise<ITemplate<any>> {
    const response = await(await verboseFetch(`https://api.github.com/repos/${archievePath}`)).json()

    if ('message' in response) throw new Error('GitHub API error: ' + response.message)

    const defaultBranch = response.default_branch

    console.log(chalk.gray`Template was found at default branch {cyan ${defaultBranch}}.`)

    const tarResponse = await verboseFetch(`https://github.com/${archievePath}/tarball/${defaultBranch}`)

    if ('message' in response) throw new Error('GitHub API error: ' + response.message)

    await extractTarball(tarResponse.body!, directory)

    return await fileInstaller(directory, directory)
}
