import type { ITemplate } from 'project-factory'
import { fileInstaller, githubInstaller, npmInstaller, tarInstaller } from './installers/index.js'

const INPUT_PATTERN = /^(?:(?<type>file|tar|github|npm):)?(?<content>.*)$/

type InstallerType = 'file' | 'tar' | 'github' | 'npm'
const INSTALLERS: Readonly<Record<InstallerType, TemplateInstaller>> = {
    'file': fileInstaller,
    'tar': tarInstaller,
    'github': githubInstaller,
    'npm': npmInstaller
}
const DEFAULT_INSTALLER_TYPE: InstallerType = 'github'

export type TemplateInstaller = (address: string, directory: string) => Promise<ITemplate<any>>

export function install(templateLocation: string, directory: string): Promise<ITemplate<any>> {
    const match = templateLocation.match(INPUT_PATTERN)

    if (match === null) throw new Error('Bad template input.')

    const type = match.groups!.type as InstallerType | ''
    const installer = INSTALLERS[type === '' ? DEFAULT_INSTALLER_TYPE : type]

    return installer(match.groups!.content, directory)
}
