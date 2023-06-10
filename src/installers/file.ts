import chalk from 'chalk'
import { access } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { createTemplate, install, ITemplate, TemplateArgs } from 'project-factory'
import prompts from 'prompts'
import { exists } from '../exists'
import { parseTemplateConfig } from '../parseTemplateConfig'

const TEMPLATE_CONFIG_FILE_NAMES: readonly string[] = [
    'template.js',
    'template.cjs',
    'template.mjs'
]

export async function fileInstaller(templateDirectory: string, directory: string): Promise<ITemplate<any>> {
    await access(templateDirectory)

    let templateConfigPath: string | null = null

    for (const configFileName of TEMPLATE_CONFIG_FILE_NAMES) {
        const configPath = join(templateDirectory, configFileName)

        if (!(await exists(configPath))) continue

        templateConfigPath = relative(dirname(__filename), configPath)
            .replaceAll('\\', '/')
    }

    if (templateConfigPath === null) throw new Error('Template config not found.')

    const absoluteTemplateConfigPath = resolve(dirname(__filename), templateConfigPath)
    console.log(chalk`Importing {green ${absoluteTemplateConfigPath}}...`)

    const importedTemplateConfig = await import(templateConfigPath)

    if (!('default' in importedTemplateConfig)) throw new Error('Template config doesn\'t has default export.')

    const templateConfig = parseTemplateConfig(importedTemplateConfig.default)

    if (templateConfig === null) throw new Error('Bad template config.')

    const args0 = 'then' in templateConfig
        ? await templateConfig
        : templateConfig
    const args1 = Array.isArray(args0)
        ? args0
        : [args0]

    if (args1.length < 0.5) throw new Error('No templates provided.')

    const args = args1.length < 1.5
        ? args1[0]
        : await chooseTemplateArgs(args1)
    args.directory = resolve(args.directory ?? '.', templateDirectory)
    const template = await createTemplate(args)

    await install(directory, template)

    return template
}
async function chooseTemplateArgs(args: readonly TemplateArgs<any, any>[]): Promise<TemplateArgs<any, any>> {
    let cancelled = false
    const {argsIndex} = await prompts({
        name: 'argsIndex',
        type: 'select',
        choices: args.map((arg, i) => ({
            title: arg.name,
            value: i
        }))
    }, {onCancel: () => cancelled = true})

    if (cancelled) throw new Error('No template was chosen.')

    return args[argsIndex]
}
