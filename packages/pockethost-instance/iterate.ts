import { readFileSync } from 'fs'
import versions from './versions.cjs'

async function main() {
  const lines = [`WORKDIR /.pbincache`]
  for (let i = 0; i < versions.length; i++) {
    const version = versions[i]
    lines.push(
      `COPY .pbincache/${version}/x64/linux/pocketbase ${version}/pocketbase`,
    )
  }
  const dockerfile = readFileSync(`./Dockerfile`, `utf8`).replace(
    /# BEGIN_PB([\s\S]*?)# END_PB/g,
    (_, content) => `# BEGIN_PB\n${lines.join(`\n`)}\n# END_PB`,
  )
  console.log(dockerfile)
}

main()
