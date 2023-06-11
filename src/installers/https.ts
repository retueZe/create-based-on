import type { ITemplate } from 'project-factory'
import { httpInstaller } from './http.js'

export async function httpsInstaller(address: string, directory: string): Promise<ITemplate<any>> {
    return httpInstaller(address, directory)
}
