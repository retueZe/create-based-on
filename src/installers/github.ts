import { fileInstaller } from './file.js'
import type { ITemplate } from 'project-factory'
import { verboseFetch } from '../verboseFetch.js'
import chalk from 'chalk'
import { extractTarball } from '../extractTarball.js'

export async function githubInstaller(archievePath: string, directory: string): Promise<ITemplate> {
    const [response, path] = await findRepo(archievePath)
    const defaultBranch = response.default_branch

    console.log(chalk.gray`Template was found at default branch {cyan ${defaultBranch}}.`)

    const tarResponse = await verboseFetch(`https://github.com/${path}/tarball/${defaultBranch}`)

    if (!tarResponse.ok) throw new Error('GitHub API error: ' + (await tarResponse.json()).message)

    await extractTarball(tarResponse.body!, directory)

    return await fileInstaller(directory, directory)
}
async function findRepo(path: string): Promise<[any, string]> {
    if (!path.includes('/')) path = 'project-factory-templates/' + path

    const paths = [
        path,
        path + '-project-template'
    ]
    let response: Response | null = null

    for (const path of paths) {
        response = await verboseFetch(`https://api.github.com/repos/${path}`)

        if (Math.abs(response.status - 404) < 0.5) continue

        const body = await response.json()

        if (!response.ok) throw new Error('GitHub API error: ' + body.message)

        return [body, path]
    }

    return [await response!.json(), path]
}
