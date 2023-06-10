import { fileInstaller, npmInstaller, tarInstaller } from './installers'

// examples:
// `file:../my-template`
// `tar:/c/Users/User/Downloads/template.tgz`
// `github:retueZe/repo`
// `npm:@retueze/pkg@1.2.3-rc.4`
const INPUT_PATTERN = /^(?:(?<type>file|tar|github|npm):)?(?<content>.*)$/
const PACKAGE_NAME_PATTERN = /^(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/)?[a-z0-9-~][a-z0-9-._~]*$/i

type InstallerType = 'file' | 'tar' | 'github' | 'npm'
const INSTALLERS: Readonly<Record<InstallerType, TemplateInstaller>> = {
    'file': fileInstaller,
    'tar': tarInstaller,
    'github': fileInstaller, // TODO: stub
    'npm': npmInstaller
}
const DEFAULT_INSTALLER_TYPE: InstallerType = 'github'

export type TemplateInstaller = (address: string, directory: string) => Promise<void>

export function install(templateLocation: string, directory: string): Promise<void> {
    const match = templateLocation.match(INPUT_PATTERN)

    if (match === null) throw new Error('Bad template input.')

    const type = match.groups!.type as InstallerType | ''
    const installer = INSTALLERS[type === '' ? DEFAULT_INSTALLER_TYPE : type]

    return installer(match.groups!.content, directory)
}
