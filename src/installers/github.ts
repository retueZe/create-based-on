import { mkdir } from 'node:fs/promises'
import { exists } from '../exists'
import tar from 'tar'
import { Transform, Writable } from 'node:stream'
import { fileInstaller } from './file'

export async function githubInstaller(archievePath: string, directory: string): Promise<void> {
    const response = await(await fetch(`https://api.github.com/repos/${archievePath}`)).json()

    if ('message' in response) throw new Error('GitHub API error: ' + response.message)

    const defaultBranch = response.default_branch
    const tarResponse = await fetch(`https://github.com/${archievePath}/tarball/${defaultBranch}`)

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
