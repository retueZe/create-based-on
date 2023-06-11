import type { ITemplate } from 'project-factory'
import { fileInstaller, githubInstaller, httpInstaller, httpsInstaller, npmInstaller, tarInstaller } from './installers/index.js'

const INPUT_PATTERN = /^(?:(?<type>file|tar|github|npm|http|https):)?(?<content>.*)$/

type InstallerType = 'file' | 'tar' | 'github' | 'npm' | 'http' | 'https'
const INSTALLERS: Readonly<Record<InstallerType, TemplateInstaller>> = {
    'file': fileInstaller,
    'tar': tarInstaller,
    'github': githubInstaller,
    'npm': npmInstaller,
    'http': httpInstaller,
    'https': httpsInstaller
}
const DEFAULT_INSTALLER_TYPE: InstallerType = 'github'

export type TemplateInstaller = (address: string, directory: string) => Promise<ITemplate>

export function install(templateLocation: string, directory: string): Promise<ITemplate> {
    const match = templateLocation.match(INPUT_PATTERN)

    if (match === null) throw new Error('Bad template input.')

    const type = match.groups!.type as InstallerType | undefined
    const installer = INSTALLERS[typeof type === 'undefined'
        ? DEFAULT_INSTALLER_TYPE
        : type]

    return installer(match.groups!.content, directory)
}
