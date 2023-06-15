import type { ITemplate } from 'project-factory'
import { httpScaffolder } from './http.js'

export async function httpsScaffolder(address: string, directory: string): Promise<ITemplate> {
    return httpScaffolder(address, directory)
}
