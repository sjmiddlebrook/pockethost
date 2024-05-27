import { readFileSync, writeFileSync } from 'fs'
import versions from './versions.cjs'

function main() {
  const lines = [`WORKDIR /.pbincache`]
  for (let i = 0; i < versions.length; i++) {
    const version = versions[i]
    const src = `./.pbincache/${version}/x64/linux/pocketbase`
    lines.push(`COPY ${src} ${version}/pocketbase`)
  }
  const dockerfile = readFileSync(`./Dockerfile`, `utf8`).replace(
    /# BEGIN_PB([\s\S]*?)# END_PB/g,
    (_, content) => `# BEGIN_PB\n${lines.join(`\n`)}\n# END_PB`,
  )
  writeFileSync(`./Dockerfile`, dockerfile, `utf8`)
}

main()
