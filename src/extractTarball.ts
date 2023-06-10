import chalk from 'chalk'
import { mkdir } from 'node:fs/promises'
import { Transform, Writable } from 'node:stream'
import { exists } from './exists.js'
import tar from 'tar'

export async function extractTarball(stream: ReadableStream<Uint8Array>, directory: string): Promise<void> {
    if (!(await exists(directory))) await mkdir(directory)

    console.log(chalk`Extracting tarball...`)

    const tarWritable = tar.extract({
        C: directory,
        stripComponents: 1
    })
    const buffer = new Transform({
        transform: (chunk, encoding, callback) => callback(null, chunk)
    })
    buffer.pipe(tarWritable)
    const completionPromise = new Promise<void>((resolve, reject) => {
        tarWritable.on('close', resolve)
        tarWritable.on('error', reject)
    })

    stream.pipeTo(Writable.toWeb(buffer))
    await completionPromise
}
