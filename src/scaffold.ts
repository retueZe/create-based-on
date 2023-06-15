import type { ITemplate } from 'project-factory'
import { fileScaffolder, githubScaffolder, httpScaffolder, httpsScaffolder, npmScaffolder, tarScaffolder } from './scaffolders/index.js'

const INPUT_PATTERN = /^(?:(?<type>file|tar|github|npm|http|https):)?(?<content>.*)$/

type ScaffolderType = 'file' | 'tar' | 'github' | 'npm' | 'http' | 'https'
const SCAFFOLDERS: Readonly<Record<ScaffolderType, TemplateScaffolder>> = {
    'file': fileScaffolder,
    'tar': tarScaffolder,
    'github': githubScaffolder,
    'npm': npmScaffolder,
    'http': httpScaffolder,
    'https': httpsScaffolder
}
const DEFAULT_SCAFFOLDER_TYPE: ScaffolderType = 'github'

export type TemplateScaffolder = (address: string, directory: string) => Promise<ITemplate>

export function scaffold(templateLocation: string, directory: string): Promise<ITemplate> {
    const match = templateLocation.match(INPUT_PATTERN)

    if (match === null) throw new Error('Bad template input.')

    const type = match.groups!.type as ScaffolderType | undefined
    const scaffolder = SCAFFOLDERS[typeof type === 'undefined'
        ? DEFAULT_SCAFFOLDER_TYPE
        : type]

    return scaffolder(match.groups!.content, directory)
}
