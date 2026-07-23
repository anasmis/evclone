import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'dist')
const workerBuild = path.join(dist, 'evplug_maroc_simulator')
const serverBuild = path.join(dist, 'server')
const hostingSource = path.join(root, '.openai', 'hosting.json')
const hostingOutput = path.join(dist, '.openai', 'hosting.json')

await fs.mkdir(serverBuild, { recursive: true })
await fs.mkdir(path.dirname(hostingOutput), { recursive: true })
await Promise.all([
  fs.copyFile(path.join(workerBuild, 'index.js'), path.join(serverBuild, 'index.js')),
  fs.copyFile(path.join(workerBuild, 'wrangler.json'), path.join(serverBuild, 'wrangler.json')),
  fs.copyFile(hostingSource, hostingOutput),
])

// Local development variables must never be part of a deployment archive.
await fs.rm(path.join(workerBuild, '.dev.vars'), { force: true })
