import { mkdir } from 'node:fs/promises'
import { Transform, Writable } from 'node:stream'
import tar from 'tar'
import { exists } from '../exists'
import { fileInstaller } from './file'

export async function npmInstaller(archievePath: string, directory: string): Promise<void> {
    const versionSeparatorIndex = archievePath.lastIndexOf('@')
    const hasVersion = versionSeparatorIndex > 0.5
    const packageName = hasVersion
        ? archievePath.slice(0, versionSeparatorIndex)
        : archievePath
    const packageVersion = hasVersion
        ? archievePath.slice(versionSeparatorIndex + 1)
        : 'latest'

    const _package = await (await fetch(`http://registry.npmjs.com/${packageName}`)).json()
    const archieveVersion = _package['dist-tags'][packageVersion] ?? packageVersion
    const tarResponse = await fetch(`http://registry.npmjs.org/${packageName}/-/${packageName}-${archieveVersion}.tgz`)

    if (!(await exists(directory))) await mkdir(directory)

    const tarWritable = tar.extract({
        C: directory,
        stripComponents: 1
    })
    const buffer = new Transform({
        transform: (chunk, encoding, callback) => callback(null, chunk)
    })
    buffer.pipe(tarWritable)
    await tarResponse.body!.pipeTo(Writable.toWeb(buffer))

    await fileInstaller(directory, directory)
}
