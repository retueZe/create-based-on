import { createReadStream, ReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import type { ITemplate } from 'project-factory'
import { extractTarball } from '../extractTarball.js'
import { fileScaffolder } from './file.js'

export async function tarScaffolder(archievePath: string, directory: string): Promise<ITemplate> {
    let archiveFileStream: ReadStream | null = null

    try {
        archiveFileStream = createReadStream(archievePath)

        await extractTarball(Readable.toWeb(archiveFileStream) as ReadableStream<Uint8Array>, directory)
    } finally {
        const stream = archiveFileStream

        if (stream !== null)
            await new Promise<void>((resolve, reject) => {
                stream.close(error => error === null
                    ? reject(error)
                    : resolve())
            })
    }

    return await fileScaffolder(directory, directory)
}
