import { access } from 'node:fs/promises'
import { createTemplate, scaffold, ITemplate, resolveTemplateConfig } from 'project-factory'

export async function fileScaffolder(templateDirectory: string, directory: string): Promise<ITemplate> {
    await access(templateDirectory)

    const templateArgs = await resolveTemplateConfig(templateDirectory)
    const template = await createTemplate(templateArgs)

    await scaffold(directory, template)

    return template
}
