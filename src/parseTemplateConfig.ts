import type { TemplateConfig } from 'project-factory'

export function parseTemplateConfig(config: unknown): TemplateConfig<any, any> | null {
    if (typeof config !== 'object' || config === null) return null
    if (!('name' in config) && !Array.isArray(config) && !('then' in config)) return null

    return config as any
}
