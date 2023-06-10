import chalk from 'chalk'

export function verboseFetch(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
    console.log(chalk`Fetching from {green ${args[0]}}...`)

    return fetch(...args).then(_ => _, error => Promise.reject(new Error('Fetch error: ' + error.message)))
}
