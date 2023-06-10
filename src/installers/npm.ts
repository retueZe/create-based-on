import chalk from 'chalk'
import type { ITemplate } from 'project-factory'
import { extractTarball } from '../extractTarball'
import { verboseFetch } from '../verboseFetch'
import { fileInstaller } from './file'

export async function npmInstaller(archievePath: string, directory: string): Promise<ITemplate<any>> {
    const versionSeparatorIndex = archievePath.lastIndexOf('@')
    const hasVersion = versionSeparatorIndex > 0.5
    const packageName = hasVersion
        ? archievePath.slice(0, versionSeparatorIndex)
        : archievePath
    const packageVersion = hasVersion
        ? archievePath.slice(versionSeparatorIndex + 1)
        : 'latest'

    const _package = await (await verboseFetch(`https://registry.npmjs.com/${packageName}`)).json()
    const archieveVersion = _package['dist-tags'][packageVersion] ?? packageVersion

    if (packageVersion !== archieveVersion) console.log(
        chalk.gray`Dist-tag {yellow ${packageVersion}} was ` +
        chalk.gray`referring to v{yellow ${archieveVersion}}.`)

    const tarResponse = await verboseFetch(
        `https://registry.npmjs.org/${packageName}/-/${packageName}-${archieveVersion}.tgz`)

    await extractTarball(tarResponse.body!, directory)

    return await fileInstaller(directory, directory)
}
