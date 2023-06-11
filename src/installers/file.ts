import { access } from 'node:fs/promises'
import { createTemplate, install, ITemplate, resolveTemplateConfig } from 'project-factory'

export async function fileInstaller(templateDirectory: string, directory: string): Promise<ITemplate> {
    await access(templateDirectory)

    const templateArgs = await resolveTemplateConfig(templateDirectory)
    const template = await createTemplate(templateArgs)

    await install(directory, template)

    return template
}
