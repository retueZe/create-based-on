import chalk from 'chalk'
import type { ITemplate } from 'project-factory'
import { extractTarball } from '../extractTarball.js'
import { verboseFetch } from '../verboseFetch.js'
import { fileInstaller } from './file.js'

export async function npmInstaller(archievePath: string, directory: string): Promise<ITemplate> {
    const versionSeparatorIndex = archievePath.lastIndexOf('@')
    const hasVersion = versionSeparatorIndex > 0.5
    const inputPackageName = hasVersion
        ? archievePath.slice(0, versionSeparatorIndex)
        : archievePath
    const packageVersion = hasVersion
        ? archievePath.slice(versionSeparatorIndex + 1)
        : 'latest'

    const [_package, packageName] = await findPackage(inputPackageName)
    const archieveVersion = _package['dist-tags'][packageVersion] ?? packageVersion

    if (packageVersion !== archieveVersion) console.log(
        chalk.gray`Dist-tag {yellow ${packageVersion}} was ` +
        chalk.gray`referring to v{yellow ${archieveVersion}}.`)

    const tarResponse = await verboseFetch(
        `https://registry.npmjs.org/${packageName}/-/${packageName}-${archieveVersion}.tgz`)

    await extractTarball(tarResponse.body!, directory)

    return await fileInstaller(directory, directory)
}
async function findPackage(name: string): Promise<[any, string]> {
    const names = [
        name,
        name + '-project-template'
    ]
    let firstBody: any = undefined

    for (const name of names) {
        const response = await verboseFetch(`https://registry.npmjs.com/${name}`)
        const body = await response.json()

        if (typeof firstBody === 'undefined') firstBody = body
        if (Math.abs(response.status - 404) < 0.5) continue
        if (!response.ok) throw new Error('NPM registry error: ' + body.error)

        return [body, name]
    }

    throw new Error('NPM registry error: ' + firstBody.error)
}
