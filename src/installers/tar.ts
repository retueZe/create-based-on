import { createReadStream, ReadStream } from 'node:fs'
import * as tar from 'tar'
import { fileInstaller } from './file'

export async function tarInstaller(archievePath: string, directory: string): Promise<void> {
    let archiveFileStream: ReadStream | null = null

    try {
        archiveFileStream = createReadStream(archievePath)
        archiveFileStream.pipe(tar.extract({
            C: directory
        }))
    } finally {
        const stream = archiveFileStream

        if (stream !== null)
            await new Promise<void>((resolve, reject) => {
                stream.close(error => error === null
                    ? reject(error)
                    : resolve())
            })
    }

    await fileInstaller(directory, directory)
}
