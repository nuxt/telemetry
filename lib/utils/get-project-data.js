import gitUrlParse from 'git-url-parse'
import parseGitConfig from 'parse-git-config'

async function getGitRemote() {
  try {
    const parsed = await parseGitConfig()
    const gitRemote = parsed['remote "origin"'].url
    return gitRemote
  } catch (err) {
    return null
  }
}

const getRepoMetadata = (url) => {
  try {
    const { source, owner, name } = gitUrlParse(url)
    return {
      source,
      owner,
      name
    }
  } catch (err) {
    return null
  }
}

export async function getProjectData({ options }) {
  const repoUrl = await getGitRemote()
  const repoMeta = repoUrl ? getRepoMetadata(repoUrl) : null
  return {
    remote: (repoUrl && gitUrlParse(repoUrl).toString('https')) || null,
    source: (repoMeta && repoMeta.source) || null,
    owner: (repoMeta && repoMeta.owner) || null,
    name: (repoMeta && repoMeta.name) || null,
    path: options && options.rootDir ? options.rootDir : process.cwd()
  }
}
