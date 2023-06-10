import { access } from 'node:fs/promises'

export async function exists(path: string): Promise<boolean> {
    try {
        await access(path)

        return true
    } catch (error: any) {
        if (typeof error === 'object' && error !== null && error.code === 'ENOENT')
            return false

        throw error
    }
}
